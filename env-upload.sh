#!/usr/bin/env bash
# env-upload.sh — push a local .env file to GitLab CI/CD variables,
# scoped to the chosen environment.
#
# Usage:
#   ./env-upload.sh test   [env-file]    # scope=test      (matches `develop` deploy)
#   ./env-upload.sh prod   [env-file]    # scope=production (matches `master` deploy)
#   ./env-upload.sh shared [env-file]    # scope=*          (visible in every env)
#
# Defaults for env-file when omitted:
#   test    → .env.test
#   prod    → .env.prod
#   shared  → .env.shared
#
# Project id is REQUIRED (per project). Resolution (first non-empty wins):
#   1. --project-id flag
#   2. $PROJECT_ID env
#   3. VITE_CI_GITLAB_PROJECT_ID in .env.local   ← recommended: set it once here
# Find the id on the GitLab project home page or Settings → General.
#
# Token resolution (first non-empty wins):
#   1. $GITLAB_TOKEN
#   2. VITE_CI_GITLAB_TOKEN in .env.local
#
# Flags:
#   --file KEY=path     upload KEY as a File-type variable from file contents
#                       (use for OVPN_CONFIG and similar). Repeatable.
#   --dry-run           print actions but make no API calls.
#   --gitlab-url URL    override the GitLab URL (default: https://gitlab.spa-limited.com).
#   --project-id ID     the GitLab project id (required).
#
# Masking — keys matching TOKEN|SECRET|PASSWORD|PASS$|KEY_B64|API_KEY are
# pushed masked. If the value violates GitLab's masking constraints
# (length, charset, whitespace) the script falls back to unmasked + warns.

set -euo pipefail

GITLAB_URL="${GITLAB_URL:-https://gitlab.spa-limited.com}"
PROJECT_ID="${PROJECT_ID:-}"
DRY_RUN=0
FILE_VARS=()
TARGET=""
ENV_FILE=""

usage() {
    cat <<EOF
Usage: $(basename "$0") <scope> [env-file] [options]

Scopes:
  test      → environment_scope=test       (matches \`develop\` deploys)
  prod      → environment_scope=production (matches \`master\` deploys)
  shared    → environment_scope=*          (visible in every env)

Options:
  --file KEY=path     Upload KEY as a File-type variable (contents of path).
                      Repeat for multiple file vars (e.g. OVPN_CONFIG).
  --dry-run           Print actions only; no HTTP calls.
  --gitlab-url URL    Override GitLab URL.
  --project-id ID     GitLab project id (or VITE_CI_GITLAB_PROJECT_ID in .env.local).
  -h, --help          This message.

Project id: set VITE_CI_GITLAB_PROJECT_ID in .env.local (recommended), or pass --project-id.
Token:      set GITLAB_TOKEN, or VITE_CI_GITLAB_TOKEN in .env.local.
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        test|prod|production|shared|all)
            TARGET="$1"
            shift
            ;;
        --file)
            FILE_VARS+=("$2")
            shift 2
            ;;
        --dry-run)
            DRY_RUN=1
            shift
            ;;
        --gitlab-url)
            GITLAB_URL="$2"
            shift 2
            ;;
        --project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            echo "Unknown option: $1" >&2
            usage
            exit 1
            ;;
        *)
            if [ -z "$ENV_FILE" ]; then
                ENV_FILE="$1"
            else
                echo "Unexpected argument: $1" >&2
                usage
                exit 1
            fi
            shift
            ;;
    esac
done

if [ -z "$TARGET" ]; then
    echo "Error: scope is required (test|prod|shared)" >&2
    usage
    exit 1
fi

# Fall back to VITE_CI_GITLAB_PROJECT_ID in .env.local when not given via flag/env.
if [ -z "$PROJECT_ID" ] && [ -f .env.local ]; then
    PROJECT_ID=$(grep -E '^[[:space:]]*VITE_CI_GITLAB_PROJECT_ID[[:space:]]*=' .env.local \
        | head -n1 \
        | sed -E 's/^[^=]*=[[:space:]]*//; s/[[:space:]]+$//; s/^"//; s/"$//; s/^'\''//; s/'\''$//')
fi

if [ -z "$PROJECT_ID" ]; then
    echo "Error: project id is required." >&2
    echo "  Set VITE_CI_GITLAB_PROJECT_ID in .env.local, export PROJECT_ID, or pass --project-id ID." >&2
    exit 1
fi

case "$TARGET" in
    test)
        SCOPE="test"
        DEFAULT_ENV_FILE=".env.test"
        ;;
    prod|production)
        SCOPE="production"
        DEFAULT_ENV_FILE=".env.prod"
        ;;
    shared|all)
        SCOPE="*"
        DEFAULT_ENV_FILE=".env.shared"
        ;;
esac

ENV_FILE="${ENV_FILE:-$DEFAULT_ENV_FILE}"

# ─── Resolve token ───────────────────────────────────────────────────────
TOKEN="${GITLAB_TOKEN:-}"
if [ -z "$TOKEN" ] && [ -f .env.local ]; then
    TOKEN=$(grep -E '^[[:space:]]*VITE_CI_GITLAB_TOKEN[[:space:]]*=' .env.local \
        | head -n1 \
        | sed -E 's/^[[:space:]]*VITE_CI_GITLAB_TOKEN[[:space:]]*=[[:space:]]*//; s/[[:space:]]+$//; s/^"//; s/"$//; s/^'\''//; s/'\''$//')
fi

if [ -z "$TOKEN" ]; then
    echo "Error: no GitLab token found." >&2
    echo "  Either export GITLAB_TOKEN, or add VITE_GITLAB_TOKEN=... to .env.local" >&2
    exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: env file '$ENV_FILE' not found." >&2
    echo "  Pass a path explicitly, e.g.: $(basename "$0") $TARGET .env.local" >&2
    exit 1
fi

API="$GITLAB_URL/api/v4/projects/$PROJECT_ID/variables"

# ─── Helpers ─────────────────────────────────────────────────────────────
should_mask() {
    local key="$1"
    [[ "$key" =~ TOKEN|SECRET|PASSWORD|PASS$|KEY_B64|API_KEY ]]
}

mask_safe() {
    # GitLab masking constraints: length >= 8, no whitespace,
    # charset [A-Za-z0-9+/=@:.~-]
    local value="$1"
    [ ${#value} -lt 8 ] && return 1
    [[ "$value" =~ [[:space:]] ]] && return 1
    [[ ! "$value" =~ ^[A-Za-z0-9+/=@:.~-]+$ ]] && return 1
    return 0
}

trim() {
    local s="$1"
    s="${s%$'\r'}"
    s="${s#"${s%%[![:space:]]*}"}"
    s="${s%"${s##*[![:space:]]}"}"
    printf '%s' "$s"
}

strip_quotes() {
    local s="$1"
    if [[ "$s" == \"*\" ]]; then
        s="${s:1:${#s}-2}"
    elif [[ "$s" == \'*\' ]]; then
        s="${s:1:${#s}-2}"
    fi
    printf '%s' "$s"
}

variable_exists() {
    local key="$1"
    local code
    code=$(curl --silent --output /dev/null --write-out "%{http_code}" \
        --request GET "$API/$key?filter[environment_scope]=$SCOPE" \
        --header "PRIVATE-TOKEN: $TOKEN")
    [ "$code" = "200" ]
}

# upload_variable KEY VALUE [VARIABLE_TYPE]
upload_variable() {
    local key="$1"
    local value="$2"
    local var_type="${3:-env_var}"
    local masked="false"

    if [ "$var_type" = "env_var" ] && should_mask "$key"; then
        if mask_safe "$value"; then
            masked="true"
        else
            echo "  ⚠ $key — value doesn't satisfy GitLab masking constraints; uploading unmasked." >&2
        fi
    fi

    if [ "$DRY_RUN" = "1" ]; then
        echo "  [dry-run] $key (scope=$SCOPE, type=$var_type, masked=$masked)"
        return
    fi

    local code
    if variable_exists "$key"; then
        code=$(curl --silent --output /dev/null --write-out "%{http_code}" \
            --request PUT "$API/$key?filter[environment_scope]=$SCOPE" \
            --header "PRIVATE-TOKEN: $TOKEN" \
            --form-string "value=$value" \
            --form-string "variable_type=$var_type" \
            --form-string "environment_scope=$SCOPE" \
            --form-string "protected=false" \
            --form-string "masked=$masked")
        if [ "$code" = "200" ]; then
            echo "  ↻ updated $key"
        else
            echo "  ✗ failed to update $key (HTTP $code)" >&2
        fi
    else
        code=$(curl --silent --output /dev/null --write-out "%{http_code}" \
            --request POST "$API" \
            --header "PRIVATE-TOKEN: $TOKEN" \
            --form-string "key=$key" \
            --form-string "value=$value" \
            --form-string "variable_type=$var_type" \
            --form-string "environment_scope=$SCOPE" \
            --form-string "protected=false" \
            --form-string "masked=$masked")
        if [ "$code" = "201" ]; then
            echo "  ✓ added $key"
        else
            echo "  ✗ failed to add $key (HTTP $code)" >&2
        fi
    fi
}

# ─── Headline ─────────────────────────────────────────────────────────────
echo "GitLab project: $GITLAB_URL/.../$PROJECT_ID"
echo "Scope:          $SCOPE"
echo "Env file:       $ENV_FILE"
[ "$DRY_RUN" = "1" ] && echo "Mode:           DRY RUN"
echo ""

# ─── Upload env_var entries ───────────────────────────────────────────────
echo "Variables:"
while IFS= read -r raw_line || [ -n "$raw_line" ]; do
    line=$(trim "$raw_line")
    [ -z "$line" ] && continue
    [[ "$line" == \#* ]] && continue
    [[ "$line" != *=* ]] && continue

    key="${line%%=*}"
    value="${line#*=}"
    key=$(trim "$key")
    value=$(trim "$value")
    value=$(strip_quotes "$value")

    # These configure THIS script — never push them as CI variables.
    if [ "$key" = "VITE_CI_GITLAB_TOKEN" ] || [ "$key" = "GITLAB_TOKEN" ] \
        || [ "$key" = "VITE_CI_GITLAB_PROJECT_ID" ] || [ "$key" = "PROJECT_ID" ]; then
        echo "  · skipping $key (tooling config, not a CI variable)"
        continue
    fi

    upload_variable "$key" "$value" "env_var"
done < "$ENV_FILE"

# ─── Upload file-type variables ────────────────────────────────────────────
if [ "${#FILE_VARS[@]}" -gt 0 ]; then
    echo ""
    echo "File variables:"
    for spec in "${FILE_VARS[@]}"; do
        if [[ "$spec" != *=* ]]; then
            echo "  ✗ bad --file spec '$spec' — expected KEY=path" >&2
            continue
        fi
        key="${spec%%=*}"
        path="${spec#*=}"
        if [ ! -f "$path" ]; then
            echo "  ✗ $key: file '$path' not found" >&2
            continue
        fi
        contents=$(cat "$path")
        upload_variable "$key" "$contents" "file"
    done
fi

echo ""
echo "Done."

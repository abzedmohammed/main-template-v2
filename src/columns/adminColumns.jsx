import { DownOutlined } from "@ant-design/icons";
import {
    DynamicBtn,
    StatusBtn,
    PrimaryDropdown,
    defaultDropdownOverlayStyle,
    formatMoney,
    getStatusObj,
    handleOpenChange,
} from "abzed-utils";
import { DeleteSvg, EditSvg } from "../svgs";

export const simpleColumns = () => [
    {
        title: "Name",
        dataIndex: "studentName",
    },
    {
        title: "Activity",
        dataIndex: "activityName",
    },
    {
        title: "Reference No",
        dataIndex: "referenceNo",
    },
    {
        title: "Amount (KES)",
        dataIndex: "fee",
    },
    {
        title: "Status",
        render: () => <StatusBtn status={getStatusObj("COMPLETED")} />,
    },
];

export const exampleDropdownColumns = ({ setSelectedObj, items }) => [
    {
        title: "Name",
        dataIndex: "usrFullName",
        render: (text, record) => (
            <div className="w-full fx_item_center gap-[.5rem]">
                <span className="txt_body_md">{record?.usrFirstName}</span>
                <span className="txt_body_md">{record?.usrLastName}</span>
            </div>
        ),
    },
    {
        title: "ID Number",
        dataIndex: "usrNationalId",
    },
    {
        title: "Email",
        dataIndex: "usrEmail",
    },
    {
        title: "Phone Number",
        dataIndex: "usrMobileNumber",
    },
    {
        title: "User Type",
        dataIndex: "usrType",
    },
    {
        title: "",
        render: (item) => (
            <PrimaryDropdown
                items={items}
                triggerButton={
                    <button className="fx_item_center gap-2.5" type="button">
                        Action
                        <DownOutlined />
                    </button>
                }
                overlayStyle={defaultDropdownOverlayStyle}
                onOpenChange={(open) =>
                    handleOpenChange(open, item, setSelectedObj)
                }
            />
        ),
        width: "4rem",
    },
];

export const exampleBtnColumns = ({ handleEdit, handleDelete }) => [
    {
        title: "Name",
        dataIndex: "usrFullName",
        render: (text, record) => (
            <div className="w-full fx_item_center gap-[.5rem]">
                <span className="txt_body_md">{record?.usrFirstName}</span>
                <span className="txt_body_md">{record?.usrLastName}</span>
            </div>
        ),
    },
    {
        title: "ID Number",
        dataIndex: "usrNationalId",
    },
    {
        title: "Phone Number",
        dataIndex: "usrMobileNumber",
    },
    {
        title: "Amount",
        dataIndex: "usrAmount",
        render: (text, record) => (
            <div className="w-full fx_item_center gap-[.5rem]">
                <span className="txt_body_md">
                    {formatMoney(record?.usrAmount)}
                </span>
            </div>
        ),
    },
    {
        title: "",
        render: (item) => (
            <div className="fx_item_center gap-2.5">
                <DynamicBtn
                    className={"plain_btn"}
                    handleClick={() => handleEdit(item)}
                    icon={<EditSvg width={19} height={19} />}
                />
                <DynamicBtn
                    className={"plain_btn"}
                    handleClick={() => handleDelete(item)}
                    icon={<DeleteSvg width={19} height={19} />}
                />
            </div>
        ),
        width: "4rem",
    },
];

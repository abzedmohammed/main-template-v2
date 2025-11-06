import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { url } from '../../utils';
import axiosInstance from '../../instance';

const initialState = {
	isProcessing: false,
};

export const save = createAsyncThunk('crudSlice/save', async (data) => {
	let saveUrl = data.saveUrl;

	delete data.saveUrl;	

	const res = await axiosInstance
		.post(`${url}${saveUrl}`, data)
		.then((res) => res.data);
	return res;
});

export const uploadFile = createAsyncThunk('crudSlice/uploadFile', async (data) => {
	let saveUrl = data.saveUrl;
	const formData = new FormData();

	formData.append('file', data.file);
	delete data.saveUrl;

	const res = await axiosInstance
	.post(`${url}${saveUrl}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);

	return res;
});

export const update = createAsyncThunk('crudSlice/update', async (data) => {
	let saveUrl = data.saveUrl;
	let url = data.url;

	delete data.saveUrl;
	delete data.url;

	const res = await axiosInstance
		.put(`${url}${saveUrl}`, data?.data)
		.then((res) => res.data);
	return res;
});

export const deleteEntry = createAsyncThunk(
	'crudSlice/deleteEntry',
	async (data) => {
		let saveUrl = data.saveUrl;

		delete data.saveUrl;

		const res = await axiosInstance
			.delete(`${url}${saveUrl}`)
			.then((res) => res.data);
		return res;
	}
);

export const crudSlice = createSlice({
	name: 'save',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(uploadFile.pending, (state) => {
				state.isProcessing = true;
			})
			.addCase(uploadFile.fulfilled, (state) => {
				state.isProcessing = false;
			})
			.addCase(uploadFile.rejected, (state) => {
				state.isProcessing = false;
			})

			.addCase(deleteEntry.pending, (state) => {
				state.isProcessing = true;
			})
			.addCase(deleteEntry.fulfilled, (state) => {
				state.isProcessing = false;
			})
			.addCase(deleteEntry.rejected, (state) => {
				state.isProcessing = false;
			})

			.addCase(update.pending, (state) => {
				state.isProcessing = true;
			})
			.addCase(update.fulfilled, (state) => {
				state.isProcessing = false;
			})
			.addCase(update.rejected, (state) => {
				state.isProcessing = false;
			})

			.addCase(save.pending, (state) => {
				state.isProcessing = true;
			})
			.addCase(save.fulfilled, (state) => {
				state.isProcessing = false;
			})
			.addCase(save.rejected, (state) => {
				state.isProcessing = false;
			});
	},
});

export default crudSlice.reducer;

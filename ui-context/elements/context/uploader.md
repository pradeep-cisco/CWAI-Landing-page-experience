# Uploader

Uploader is implemented using the web component: <hbr-uploader>.

## Description
File upload interface.

## Usage
```jsx
import { useState } from "react";
export default function Uploader() {
	const [file, setFile] = useState();

	const accept = ["image/png", "image/jpeg"];

	const onHbrFileDrop = (event) => {
		/** store dropped file(s) in files */
		const filesArray = Array.from(event.detail.files);
		const file = filesArray[0];

		console.log("onHbrFileDrop", file);

		/** Validation */
		if (!accept.includes(file.type)) {
			file.state = "error";
			file.message = "wrong file type";
		} else {
			file.state = "done";
		}

		// file.state = "done";
		// file.state = "loading";
		/** progress should always have percentage */
		// file.state = "progress";
		//file.percentage = 30;
		setFile(file);
	};

	const onHbrSelect = (event) => {
		/** store selected file in files array*/
		const { files } = event.detail;
		const file = files[0];
		if (!accept.includes(file.type)) {
			file.state = "error";
			file.message = "wrong file type";
		}

		file.state = "done";
		// // file.state = "loading";
		// // file.state = "progress";
		setFile(file);
		console.log("onHbrSelect", file);
	};

	const onHbrRemove = (file) => {
		if (file) {
			setFile();
		}
	};

	const onHbrError = (event) => {
		console.log("Error", event);
	};

	return (
		<hbr-layout direction="row" gap="lg">
			<hbr-uploader
				name="dragReact"
				container={true}
				onhbr-select={onHbrSelect}
				onhbr-file-drop={onHbrFileDrop}
				files={file ? [file] : undefined}
				onhbr-remove={onHbrRemove}
				onhbr-error={onHbrError}
				accept={accept}
			>
				{/** Inside of the container */}
				<hbr-icon name="upload-simple" slot="container-icon" />
				<span slot="trigger">Click or drag file to this area to upload</span>
				<span slot="supplemental-text">Supplemental text</span>

				{/** File List container */}
				{file && (
					<hbr-file-item
						file={file}
						state={file.state}
						percentage={file.state === "progress" ? 35 : undefined}
					>
						{file.state === "error" && file.message ? (
							<span slot="error">{file.message}</span>
						) : (
							""
						)}
					</hbr-file-item>
				)}
			</hbr-uploader>
		</hbr-layout>
	);
}

```
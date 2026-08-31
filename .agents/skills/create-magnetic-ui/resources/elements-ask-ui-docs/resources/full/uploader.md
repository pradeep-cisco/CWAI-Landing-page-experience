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

## API Reference

### Props
`accept`: Set accepted file types. (string | string[])
`container`: Set to true to draggable. (boolean)
`disabled`: Set to true to disable. (boolean)
`error`: Error message (string)
`files`: Array of files. (File[])
`label`:  (string)
`multiple`: Allow multiple files to upload (boolean)
`name`: The name of the uploader. (string)
`size`: The uploader's size. ("medium" | "small")

### Events
`hbr-error`: Emitted when there is an error
`hbr-file-drop`: Emitted when the file(s) dropped.
`hbr-select`: Emitted when a file is selected

### Slots
`[default]`: The uploader's file list slot.
`container-icon`: The upload icon slot.
`label`: The uploader's label.
`label-suffix`: The uploader's label suffix.
`optional-text`: The button trigger version, it is required to have a description stating the file restrictions, like file format and file size.
`optional-title`: The button trigger version's optional title.
`supplemental-text`: A supplementary text in the container, such as file size or file type restrictions.
`trigger`: The select file trigger.

### Custom CSS Properties
--file-container-width: File list container width, recommended for medium is 400px and small is 320px.
--max-height: Max height of the file list container. Will show scroll if exceed.
--width: Medium draggable uploader container width, recommended for medium is 400px and small is 320px.

### Parts
`base`: The base wrapper.
`container-icon`: upload icon
`content`: Main and supplemental-text content wrapper.
`drop-zone`: The drop zone.
`error-message`: The error message wrapper.
`label`: Drag and drop's content wrapper
`list-container`: The file list wrapper.
`supplemental-text`: The supplementary text.
import { FileInput, Select, TextInput, Button } from 'flowbite-react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';


export default function CreatePost() {
	return (
		<div className="min-h-screen p-3 max-w-3xl mx-auto">
			<h1 className="text-center text-3xl my-7 font-semibold dark:text-white">Create Post</h1>
			<form className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 sm:flex-row justify-between">
					<TextInput className="flex-1" type="text" placeholder="Title" required id="title" />
					<Select>
						<option value="uncatogorized">Select a category</option>
						<option value="ai">Ai dominations in future</option>
						<option value="dogs">Why dogs are people bestfriend</option>
						<option value="mobile">New mobile invention</option>
						<option value="gpu">How Nvidea become trillion doller company? </option>
					</Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-dotted p-3">
               <FileInput typeof='file' accept='image/*' />
               <Button type="button" size='sm' outline>Upload image</Button>
            </div>
            <ReactQuill theme='snow' placeholder='write something comes in your mind...' className='h-72 mb-12 dark:text-white' />
            <Button type='submit' >Publish</Button>
			</form>
		</div>
	);
}

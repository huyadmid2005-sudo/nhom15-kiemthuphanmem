# HMS Community Markdown Editor

## Overview

The HMS Community now features a powerful markdown editor that allows users to create rich, formatted posts with image upload capabilities.

## Features

### 📝 Markdown Support

- **Headers**: Use `#`, `##`, `###` for different heading levels
- **Bold**: Use `**text**` or `__text__`
- **Italic**: Use `*text*` or `_text_`
- **Links**: Use `[text](url)`
- **Lists**: Use `-` or `*` for bullets, `1.` for numbers
- **Code**: Use `backticks` for inline code, ``` for code blocks
- **Quotes**: Use `>` for blockquotes

### 🖼️ Image Upload

- **Drag & Drop**: Drag images directly into the editor
- **File Upload**: Click the "Upload Image" button to select files
- **Paste**: Copy and paste images directly (Ctrl+V)
- **Automatic Markdown**: Images are automatically formatted as `![filename](url)`

### 🎯 Edit Functionality

- **Own Posts Only**: Users can only edit posts they created
- **Real-time Preview**: See how your markdown will look as you type
- **Save/Cancel**: Easy save and cancel options while editing

## How to Use

### Creating a New Post

1. Enter your post title
2. Use the markdown editor to write your content
3. **Add Images**:
   - Click "Upload Image" button to select files
   - Or paste images directly with Ctrl+V
   - Or drag and drop images into the editor
4. Use the preview tab to see how your post will look
5. Click "Share Post" to publish

### Editing a Post

1. Find your own post (edit button only appears on your posts)
2. Click the "Edit" button
3. Modify the title and content using the markdown editor
4. Add or remove images as needed
5. Click "Save" to update or "Cancel" to discard changes

### Markdown Examples

#### Text Formatting

```markdown
# Main Heading

## Sub Heading

**Bold text**
_Italic text_
`Code snippet`
```

#### Lists

```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

#### Images

```markdown
![Image Description](image-url)
```

#### Links

```markdown
[Click here](https://example.com)
```

#### Quotes

```markdown
> This is a quote
> It can span multiple lines
```

## Technical Details

### API Integration

- Uses `/community-portal/upload` endpoint for image uploads
- Supports `multipart/form-data` for file uploads
- Returns `UploadFileResponseDto` with `fileUrl` for markdown insertion

### Response Format

```json
{
  "fileName": "image.jpg",
  "fileType": "image/jpeg",
  "filePath": "/uploads/images/",
  "fileSize": 1024000,
  "fileUrl": "https://domain.com/uploads/images/image.jpg"
}
```

### Security

- Only authenticated users can create/edit posts
- Users can only edit their own posts
- File upload validation on backend
- Image type restrictions (jpeg, png, gif, etc.)

## Tips for Best Results

1. **Image Optimization**: Use reasonably sized images (< 5MB recommended)
2. **Alt Text**: Provide descriptive alt text for images for accessibility
3. **Preview**: Always check the preview before posting
4. **Formatting**: Use consistent formatting for better readability
5. **Links**: Test external links before posting

## Troubleshooting

### Image Upload Issues

- Check file size (must be under server limit)
- Ensure stable internet connection
- Verify image format is supported
- Try refreshing the page if upload fails

### Editing Issues

- Only your own posts show edit buttons
- Make sure you're logged in
- Refresh page if edit form doesn't appear

### Markdown Rendering

- Check markdown syntax if formatting looks wrong
- Use preview mode to verify appearance
- Some advanced markdown features may not be supported

## Future Enhancements

- [ ] Video upload support
- [ ] File attachment capabilities
- [ ] Advanced markdown features (tables, task lists)
- [ ] Collaborative editing
- [ ] Version history for posts

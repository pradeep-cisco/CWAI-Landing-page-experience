# Part 1 — One-Time Computer Setup
## 1. Install Xcode Command Line Tools
1. Open **Terminal**
2. In Terminal, copy and paste:

```
xcode-select --install   
```
1. A dialog box will appear on your screen.
Follow the installation instructions shown in that dialog.
2. After installation completes, verify it worked:

```
xcode-select -p   
```
---
## 2. Install Node
### Step A — Install nvm
In Terminal, run:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash   
```
### Step B — Activate nvm
Run:

```
source ~/.zshrc   
```
### Step C — Install Node
Run:

```
nvm install --lts   
```
Verify installation:

```
node -v   
```
You should see a version number.

---
# Part 2 — Open and Run the Project
## 3. Unzip the Repo
Unzip the repo zip folder you were given.
Move the unzipped folder to a location you can easily find.

## 4. Open the Project in Cursor
1. Open **Cursor**
2. Click **"Open a folder"**
3. Select the folder you just unzipped

You should now see project files in the left sidebar.

## 5. Install Project Dependencies
1. In Cursor, open the terminal:
   * Click **Terminal** in the top Mac menu bar
   * Click **New Terminal**

2. In the terminal that opens at the bottom of Cursor, run:

```
npm install   
```
Wait until it finishes.

## 6. Start the App
In the same terminal, run:

```
npm run dev   
```
After a few seconds:

* The app may open automatically inside Cursor
* Or you will see a link such as:

```
http://localhost:3000   
```
---
# Part 3 — Generate UI Using Cursor
## 7. Open the AI Panel
In the top-right corner of Cursor:

* Click the AI panel toggle button
* It is to the left of the Settings icon

This opens the Cursor AI assistant.

## 8. Generate Your First UI
Try entering this prompt:

```
Generate a network health dashboard for this app.   
```
Review the suggested changes and accept them if appropriate.

---
## Using Figma Designs in Your Prompt
### 1. Install the Figma MCP server
Follow the installation steps here:
https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/#cursor

### 2. Copy a Figma Node Link
In Figma:

* Right-click a frame or element
* Click **"Copy link to selection"**

### 3. Use It in a Prompt
Paste something like:

```
<PASTE-FIGMA-LINK-HERE>

Generate a page with layout and styling similar to this Figma design.   
```
You might get prompted to give Cursor permission to run MCP tools, so keep an eye out for these permissions to appear in the cursor agent's response.

---
## Additional Prompt Examples
https://magnetic-web.cisco.com/docs/ai/guides/code-generation
# email-spammer

Email-spammer is a software to send many identical emails via a SMTP server to one replicant at once. 

## Usage
**For Windows only:** (Download the Setup.exe from Release and run it **-OR-**)  
Download source code and build it yourself:
```bash
npm install
npm run make
```
The executable file can be found in `{project directory}/out/make/{file_path_depending_on_OS}`


### Windows
Building it yourself: `file_path_depending_on_OS` = `squirrel.windows/x64/EMail Spammer-{version} Setup.exe`

### Linux & Mac
**NOT TESTED**


Once `Email Spammer` is installed, you have to login to a SMTP server. After that, the software can be used to spam emails.

## Limitation

- EMails can only be sent via a SMTP server
- No validation, if login to SMTP server was successful
- No validation, if EMail has been sent (or how many)
- No error catching or alerting the user if an error occured

**-> I might be workin on these limitations at some point in time**

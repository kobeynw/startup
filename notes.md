# Notes

> ## Basics of Git
Initialize repository in Github first, then clone to vs code using the URL. Use git status to check the current state of the files. Forking a repo is essentially copying it to experiment with, but a pull request can suggest changes to the author if desired.

### Basic Git Pattern:
1. Always pull before making a commit to avoid conflicts
2. Make changes to the code
3. Commit the changes
4. Push the changes to github

### Resolve Conflicts Using VS Code:
1. Open the file with the conflict
2. Open the source control tab and click the three dots
3. Select Branch > Merge Branch
4. Remove the textual conflict delimiters and modify the file to be how it should be
5. Commit and push the revised file

> ## Amazon Web Services - EC2

### Security Groups
Security Groups house the rules for the server. Security group rules specify both the port that is accessible on your server, and the source IP address that requests are allowed from. By allowing HTTP, HTTPS, and SSH, access is granted to most devices to access the address.

### SSH Into the Server
To remote shell into the server via the terminal, use the key pair file (saved as a .pem file securely), and the ip address.

```console
ssh -i [key pair file] ubuntu@[ip address]
```

To ensure permissions are not accessible to anyone, run the following command.

```console
chmod  600 [key pair file]
```

Once connected, you will be in the ubuntu user's home directory, which can be navigated (Use ls -l to view files). Use the exit command to close the remote shell.

### Keep the Same Public IP Address
Assign an Elastic IP Address by allocating and then associating one via the Network and Security tab on the left menu of the EC2 Service. **IMPORTANT NOTE**: the elastic IP address is allocated until you release it, not until you terminate your instance, so make sure to release it when it is not needed anymore.

> ## Amazon Web Services - Route 53

### Purchasing a Domain Name
AWS offers several options for a TLD, with the cheapest being .click for $3. After purchasing a domain name through Route 53 on the AWS site, the Route 53 dashboard should show "Hosted Zone" for the domain.

### Manage DNS Records
(DNS = Domain Name System)
1. Go to the Route 53 service
2. Select the Hosted Zones option from the left menu
3. Click your domain name to view the records (e.g. NS and SOA)
4. Create a new A type record with a value of your IP address
5. Create another new A type record with a value of your IP address and a Record Name of "*" to match any subdomains.

You should now be able to access the website via the domain name.
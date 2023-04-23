# He3 Official Open Source Tools

This repository contains open source tools developed by He3 official. You can refer to them to develop tools for He3 and publish them in the official store.

To create a tool, you can refer to [Contributing guide](#Contributing) below.

He3 Store: https://portal.he3app.com/tools

## Tool Types

Currently, there are two types of tools:

- Batch tools
- Single tools

Batch tools are designed for the convenience of writing multiple similar tools in a single project, such as the batch-json directory, which contains all the tools in the He3 client JSON category.

For single tools, you can use the directory name as a search keyword in the He3 client to find the corresponding tool.



## Contributing

We welcome contributions from the community to improve our tools and resources. If you're interested in contributing, please follow the [Development Guide](#Development Guide).



### Development Guide

This guide will introduce the process and guidelines for developing tools. You can also refer to [He3 documentation](https://docs.he3app.com/).



### Step 1: Install He3 Client

Make sure you have installed the latest He3 client. If not, download it from the official website https://he3.app/. The He3 client version requirement is v1.3.0 or above.



### Step 2: Login to He3 Client

Open the He3 client and select your login account in the top right corner.



### Step 3: Create a Tool

There are two ways to create a tool:

#### Option 1: Fork the Demo Repository

- Fork the [he3-tool-demo](https://github.com/he3-app/he3-tool-demo) repository and clone it to your local machine.

#### Option 2: Create through Portal

- Go to https://portal.he3app.com/create-tools and fill in the tool information in the form. Click "Download Tool Template" to download the tool template zip file.

> In addition, we have also prepared some open-source tools for your: [tools-example](https://github.com/he3-app/tools-example).



### Step 4: Develop the Tool

Enter the tool directory downloaded in step 3, install dependencies, and develop the tool with hot reload.

> Note: The `npm` command needs to be executed in a Node environment. Please click on [nodejs](https://nodejs.org) to install.

```shell
npm install
npm run dev
```

Then, open the He3 client and check out your tool.

#### Tools Component Documentation

You may need to use [He3 Component](https://docs.he3app.com/components/Button.html) during development.



### Step 5: Publish the Tool

After finishing the development, you can publish the tool to the He3 Store.



**Note: Some points you may pay attention to before publishing:**

> You may need to modify the information in `meta.locale.json` to provide detailed information of your tool. He3 can automatically help you handle the internationalization of metadata. Refer to the [Internationalization](https://docs.he3app.com/guide/advance/i18n.html) documentation.

> The `id` field in the `package.json` file is the identity of each tool. 
>
> So, before publishing, **please modify the `id` field in the `package.json` file**.

> The `Version` field in the `package.json` file is the identity of each version of tool.
>
> So,  before publishing, **please modify the `Version` field in the `package.json` file**, and make sure it larger than the published one.



- After all, You can publish the tool by running the following command:

```shell
npm run publish
```

After publishing, you will get the tool's URL link, which you can use by opening the tool or sharing it with others.

In addition, you can see the detailed information of your tool in the [My Tools](https://portal.he3app.com/my-tools) menu and the [He3 Store](https://portal.he3app.com/tools).



## Support

If you encounter any issues or have any questions about the He3 open platform or demo tool, please reach out to our support team at https://github.com/he3-app/he3-feedback/discussions.
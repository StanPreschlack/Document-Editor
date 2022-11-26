# DocuShare

## note:

this is not the deploy repository of this project and does not reflect recent changes.
## Overview

This project is a cloud based google docs inspired application which aims to facilitate document sharing and editing in a similar capacity. The application implements a serverless design using google firestore and firebase for deployment. Login and user authentication is powered by google firebase authentication simplifying and securing the application. The site is built using the [vueJS](https://vuejs.org/guide/introduction.html) framework. Google firebase does not require schemas and data is inserted dynamically within the vue middleware. Document sharing will be implemented using [socket.io](https://socket.io/) to update document state for multiple people editing. The editor itself is built upon the [tiptap api](https://tiptap.dev/) which facilitates document editing and formatting, however its capabilities are considerably more advanced including (eventually) remote and shared code editing with syntax highlighting and code execution as well as a number of customizations and tiptap plugins that I have found.

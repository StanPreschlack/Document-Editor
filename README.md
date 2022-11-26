# DocuShare

## note:

this is not the deploy repository of this project and does not reflect recent changes.
## Overview

This project is a cloud based google docs inspired application which facilitates document sharing and editing in a similar capacity. The application implements a serverless design using google firestore and firebase for deployment. Login and user authentication is powered by google firebase authentication simplifying and securing the application. The site is built using the [vueJS](https://vuejs.org/guide/introduction.html) framework. Google firebase does not require schemas and data is inserted dynamically within the vue middleware. Document sharing will be implemented using [socket.io](https://socket.io/) to update document state for multiple people editing. The editor itself is built upon the [tiptap api](https://tiptap.dev/) which facilitates document editing and formatting, however its capabilities are considerably more advanced including (eventually) remote and shared code editing with syntax highlighting and code execution as well as a number of customizations and tiptap plugins that I have found.

## Data Model

This application stores user email, and password as well as documents which are saved within their account in a separate collection which is referenced by google firebase relational mapping. Documents have three feilds: the name, the slug, and an object which represents the document content including fonts and other formatting. Currently there are issues saving the code block format and the ordered list but other features are saving no problem.

## Site map

<img width="681" alt="Screen Shot 2022-11-21 at 7 16 59 PM" src="https://user-images.githubusercontent.com/91580726/203183972-0ea31f74-8aa3-44ff-a8f5-7d06e3a4fcf4.png">

## User Stories or Use Cases

#### current:
1: A user can register an account <br/>
2: A user can login and create a document. <br/>
3 A user can edit the document using the avalable tools <br/>
4: A user can save their progress and log out.<br/> 

#### future:
5: A user can download their document as a PDF file. <br/>
6: A document can be shared with another user who can be given edit access (the document will show up in their account). <br/>
7: A user can write code with syntax highlighting and specify a language and then execute it remotely. <br/>

## Research Topics

vueJS
Google Firebase
Google Firestore
serverless architecture
socket.io
TipTap

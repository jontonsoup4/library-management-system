# Library Management System

## Getting Started

Installation steps can be found in the `client` and `server` folders.

## Routes
* _/admin_ - admin routes
    * _/add-book_ - add book
    * _/books_ - view status of all books
        * _/:book_id_ - edit/delete book
* _/books_ - view all books and checkout in modal
    * _/:book_id_ - view and check out book
* _/account_ - view book history and manage checked out books
* _/sign-in_ - sign in

## Tables
* Roles: _id, role_
* Users: _id, email, first_name, last_name, role_id_
* Books: _id, title, author, isbn, description, page_count, release_date, cover_url, status_id_
* Statuses: _id, status_
* Transactions: _id, book_id, user_id, checked_out, checked_out_by, due_date, checked_in, checked_in_by_

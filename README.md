# Library Management System

## Getting Started

Installation steps can be found in the `client` and `server` folders.

The whole app can alternatively be spun up as a production ready build using a single command with Docker:
```shell script
docker-compose up
# then visit localhost:3000
```

## Routes
-[x] _/admin_ - admin routes
    -[x] _/add-book_ - add book
    -[x] _/books_ - view status of all books
        -[x] _/:book_id_ - edit/delete book
-[x] _/books_ - view all books and checkout in modal
    -[x] _/:book_id_ - view and check out book
-[x] _/account_ - view book history and manage checked out books
-[x] _/sign-in_ - sign in

## Tables
-[x] Roles: _id, role_
-[x] Users: _id, email, first_name, last_name, role_id_
-[x] Books: _id, title, author, isbn, description, page_count, release_date, cover_url, status_id_
-[x] Statuses: _id, status_
-[x] Transactions: _id, book_id, user_id, checked_out, checked_out_by, due_date, checked_in, checked_in_by_

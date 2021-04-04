# Web Gallery REST API Documentation

### Create

- Description: Sign up a new user
- request: "POST api/signup/"
- content-type: "application/json"
- body: object
    - email: (string) user's email. Must be formatted as a valid email. 
    - password: (string) user's password
- response: 200
    - content-type: "application/json"
    - body: (string) "User: _:username_ signed up"
- response: 409
    - content-type: "text/html"
    - body: (string) "username: _:username_ already exists"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -H "Content-Type: 'application/json'"
        -d "{'username': 'user 1', 'password': '434ewrefe3'}"
        http://localhost:3000/signup/
```

- description: Sign in existing user
- request: "POST /signin/"
    - content-type: "application/json"
    - body: object
        - username: (string) user's username
        - password: (string) user's password
- response: 200
    - content-type:"application/json"
    - body: (string) "User: _:username_ signed in"
- response: 401
    - content-type: "text/html"
    - body: (string) "Incorrect login credentials"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -H "Content-Type: 'application/json'"
        -d "{'username': 'user 1', 'password': '434ewrefe3'}"
        http://localhost:3000/signin/
```

- description: Add a new image
- request: "POST /api/images/"
    - content-type: "multipart/form-data"
    - body: object
        - title: (string) the title of the iamge
        - picture: (file) the image uploaded
- response: 200
    - content-type: "application/json"
    - body: object
        - _id: (string) the image id
        - author: (string) the author of the image
        - title: (string) the title of the image
        - image: (object) json object containing image file details
        - createdAt: (string) Time the file was uploaded
        - updatedAt: (string) Time the file was last modified
- response: 400
    - content-type: "text/html"
    - body: (string) "A required field is missing, please fix request and try again."
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied" 
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -F title=test title -F picture=file.txt http://localhost:3000/api/images/
```

- description: Add a new comment to an image
- request: "POST /api/comments/:id/"
    - content-type: "application/json"
    - body: object
        - content: (string) content of the comment
- response: 200
    - content-type: "application/json"
    - body: object
        - _id: (string) the comment id
        - imageId: (string) The id of the parent image
        - author: (string) The author of the comment
        - content: (string) The content of the comment
        - createdAt: (string) Time the comment was added
        - updatedAt: (string) Time the comment was last modified
- response: 400
    - content-type: "text/html"
    - body: (string) "A required field is missing, please fix request and try again."
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied" 
- response: 404
    - content-type: "text/html"
    - body: (string) No image with id :id could be found
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -H "Content-Type: 'application/json'"
        -d "{'content': 'test comment'}"
        http://localhost:3000/api/comments/dsfdf3we/
```

### Read

- description: Signs out currently authenticated user
- request: "GET /signout/"
- response: 200
    - content-type: "application/json"
    - body: (string) "User has signed out"
```
$ curl http://localhost:3000/signout/
```

- description: Gets list of all users
- request: "GET /api/users/"
- response: 200
    - content-type: "application/json"
    - body: (list of objects) contains user objects
        - _id: (string) user's username
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl http://localhost:3000/api/users/
```

- description: Get most recent image of specified user
- request: "GET /api/images/:author/"
- response: 200
    - content-type: "application/json"
    - body: object
        - _id: (string) the image id
        - author: (string) the author of the image
        - title: (string) the title of the image
        - image: (object) json object containing image file details
        - createdAt: (string) Time the file was uploaded
        - updatedAt: (string) Time the file was last modified
        - hasPrev: (boolean) Indicates whether a previous image in the gallery exists
        - hasNext: (boolean) Indicates whether a next image in the gallery exists
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl http://localhost:3000/api/images/user1/
```

- description: Gets image file for specified image
- request: "GET /api/images/:id/image/"
- response: 200
    - content-type: _:image mimetype_
    - body: _:image file_
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- response: 404
    - content-type "text/html"
    - body: (string) "No image with id :id could be found"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl http://localhost:3000/api/images/5435easfdf2/image/
```

- description: Gets either next or prev image of specified one
- request: "GET /api/images/:id/:action/"
- response: 200
    - content-type: "application/json"
    - body: object
        - _id: (string) the image id
        - author: (string) the author of the image
        - title: (string) the title of the image
        - image: (object) json object containing image file details
        - createdAt: (string) Time the file was uploaded
        - updatedAt: (string) Time the file was last modified
        - hasPrev: (boolean) Indicates whether a previous image in the gallery exists
        - hasNext: (boolean) Indicates whether a next image in the gallery exists
- response: 400
    - content-type: "text/html"
    - body: (string) "Incorrect action, please fix request and try again"
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied" 
- response: 404:
    - content-type: "text/html"
    - body: (string) "No image with id :id could be found"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl http://localhost:3000/api/images/fdf43ade/next/
```

- description: Gets requested comment page for image
- request: "GET /api/comments/:id/[?page=0]/"
- response: 200
    - content-type: "application/json"
    - body: object
        - items: (list of objects) contains comment objects
            - _id: (string) the comment id
            - imageId: (string) The id of the parent image
            - author: (string) The author of the comment
            - content: (string) The content of the comment
            - createdAt: (string) Time the comment was added
            - updatedAt: (string) Time the comment was last modified
        - hasNext: (boolean) Indicates whether another page of comments exists after this one
        - page: (number) Indicates page number of comments
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl http://localhost:3000/api/comments/gfdg34asde/?page=0/
```

### Update

### Delete

- description: Delete specific image and all associated comments.
    If other images exist in the user's gallery, returns the next image to be displayed.
- request: "DELETE /api/images/:id/"
- response: 200
    - content-type: "application/json"
    - body: object
        - _id: (string) the image id
        - author: (string) the author of the image
        - title: (string) the title of the image
        - image: (object) json object containing image file details
        - createdAt: (string) Time the file was uploaded
        - updatedAt: (string) Time the file was last modified
        - hasPrev: (boolean) Indicates whether a previous image in the gallery exists
        - hasNext: (boolean) Indicates whether a next image in the gallery exists
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- response: 404
    - content-type: "text/html"
    - body: (string) "No image with id :id could be found"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -X DELETE
    http://localhost:3000/api/images/3ewfsdsdee/
```

- description: Deletes specified comment from image and returns the page of comments to be displayed
- request: "DELETE /api/comments/:id/"
- response: 200
    - content-type: "application/json"
    - body: object
        - items: (list of objects) contains comment objects
            - _id: (string) the comment id
            - imageId: (string) The id of the parent image
            - author: (string) The author of the comment
            - content: (string) The content of the comment
            - createdAt: (string) Time the comment was added
            - updatedAt: (string) Time the comment was last modified
        - hasNext: (boolean) Indicates whether another page of comments exists after this one
        - page: (number) Indicates page number of comments
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied" 
- response: 404
    - content-type: "text/html"
    - body: (string) No comment with id :id could be found.
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -X DELETE
    http://localhost:3000/api/comments/sdr34erefe/
```
    

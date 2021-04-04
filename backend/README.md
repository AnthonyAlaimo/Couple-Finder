# Web Gallery REST API Documentation

### Create

- Description: Sign up a new user
- Request: "POST /api/signup/"
    -  content-type: "application/json"
    -  body: object
        - email: (string) user's email. Must be formatted as a valid email. 
        - password: (string) user's password
- Response: 200
    - content-type: "application/json"
    - body: (string) "OK"
- Response: 409
    - content-type: "text/html"
    - body: (string) "Invalid request, email is already in use."
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -H "Content-Type: application/json"
        -d '{"email": "test@testdfdf.com", "password": "434ewrefe3"}'
        https://couple-finder.me/api/signup
```

- Description: Sign in existing user based on email, password
- Request: "POST /api/signin/"
    - Content-type: "application/json"
    - Body: object
        - email: (string) user's email. Must be formatted as a valid email.
        - password: (string) user's password
- Response: 200
    - content-type:"application/json"
    - body: (string) "OK"
- Response: 401
    - content-type: "text/html"
    - body: (string) "Incorrect login credentials"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -H "Content-Type: application/json"
        -d '{"email": "test@testdsfdsf.com", "password": "434ewrefe3"}'
        https://couple-finder.me/api/signin
```

- Description: Post profile for current user
- Request: "POST /api/profile/"
    - content-type: "multipart/form-data"
    - body: object
        - name: (string) the name of the user
        - birth_date: (string) the string representation of the birthday of the user
        - gender: (string) the gender of the user
        - bio: (string) the bio of the user
        - profile_picture: (file) the image uploaded
- Response: 200
    - content-type: "application/json"
    - body: object
        - name: (string) the name of the user
        - bio: (string) the bio of the user
        - gender: (string) the gender of the user
        - age: (number) the age of the user in years
        - pictures: [object] array containing pictures of the user
            - filename: (string) randomly generated filename
            - id: (string) randomly generated id
            - is_profile_picture: (boolean) true if picture is the profile picture for the user
            - mimetype: (string) mimetype of the image
            - path: (string) path of the image on disc     
- Response: 400
    - content-type: "text/html"
    - body: (string) "A required field is missing, please fix request and try again."
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied" 
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -F name=Adam -F birth_date=1998-03-04 -F profile_picture=file.jpg -F gender=MALE -F bio=ferfsgeffsafefa https://couple-finder.me/api/profile
```

### Read

- Description: Signs out currently authenticated user
- Request: "GET /api/signout/"
- Response: 200
    - content-type: "application/json"
    - body: (string) "OK"
```
$ curl https://couple-finder.me/api/signout
```

- Description: Get survey questions and answers
- Request: "GET /api/survey/"
- Response: 200
    - content-type: "application/json"
    - body: [object]
        - question_number: (number) id of the question
        - question_text: (string) text of the question
        - survey_options: [object]
            - answer_number: (number) id of the answer option
            - answer_text: (string) text of the answer  
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl https://couple-finder.me/api/survey
```

- Description: Get most recent image of specified user
- Request: "GET /api/images/:author/"
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
    

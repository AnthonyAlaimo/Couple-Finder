# Couple Finder API Documentation

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
$ curl -H "Content-Type: application/json" -d '{"email": "test1234@test.com", "password": "test"}' https://couple-finder.me/api/signup
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
# Will save authentication headers to cookie-file.txt which is required by all other requests
$ curl -H "Content-Type: application/json" -d '{"email": "test1234@test.com", "password": "test"}' https://couple-finder.me/api/signin -c cookie-file.txt
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
$ curl -F name=Adam -F birth_date=1998-03-04 -F profile_picture=@file.jpg -F gender=MALE -F bio="Hello world" https://couple-finder.me/api/profile -b cookie-file.txt
```

### Read

- Description: Signs out currently authenticated user
- Request: "GET /api/signout/"
- Response: 200
    - content-type: "application/json"
    - body: (string) "OK"
```
$ curl https://couple-finder.me/api/signout -b cookie-file.txt
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
$ curl https://couple-finder.me/api/survey -b cookie-file.txt
```

- Description: Get profile of currently logged in user
- Request: "GET /api/profile/"
- Response: 200
    - content-type: "application/json"
    - body: object
        - bio: (string) bio of the user
        - gender: (string) gender of the user
        - name: (string) name of the user
        - age: (number) age of the user
        - foods_resp: (number) response to food survey question
        - music_resp: (number) response to music survey question
        - personality_resp: (number) response to the personality survey question
        - pets_resp: (number) response to the pets survey question
        - smokes_resp: (number) response to the smokes survey question
        - traits_resp: (number) response to the traits survey question
        - pictures: [object] array containing pictures of the user
            - filename: (string) randomly generated filename
            - id: (string) randomly generated id
            - is_profile_picture: (boolean) true if picture is the profile picture for the user
            - mimetype: (string) mimetype of the image
            - path: (string) path of the image on disc
        - filter: filter values for the user
            - lower_age_range: (number) preferred minimum age
            - upper_age_range: (number) preferred maximum age
            - preferred_gender: (string) preferred gender
            - smokes: (number) preferred smoking preference
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl https://couple-finder.me/api/profile -b cookie-file.txt
```

- Description: Gets image file for specified image
- Request: "GET /api/pictures/:id/picture/"
- Response: 200
    - content-type: _:image mimetype_
    - body: _:image file_
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- Response: 404
    - content-type "text/html"
    - body: (string) "No image with id could be found"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl https://couple-finder.me/api/pictures/b44c04fd-03c1-4b1f-9f8c-50f2cf19649b/picture -b cookie-file.txt
```

- Description: Gets at most 10 new matches for the user based on their filters
- Request: "GET /api/new-matches/"
- Response: 200
    - content-type: "application/json"
    - body: [object]
        - bio: (string) bio of the match
        - gender: (string) gender of the match
        - name: (string) name of the match
        - email: (string) email of the match
        - age: (number) age of the match
        - foods_resp: (number) response to food survey question
        - music_resp: (number) response to music survey question
        - personality_resp: (number) response to the personality survey question
        - pets_resp: (number) response to the pets survey question
        - smokes_resp: (number) response to the smokes survey question
        - traits_resp: (number) response to the traits survey question
        - pictures: [object] array containing pictures of the match
            - filename: (string) randomly generated filename
            - id: (string) randomly generated id
            - is_profile_picture: (boolean) true if picture is the profile picture for the match
            - mimetype: (string) mimetype of the image
            - path: (string) path of the image on disc
- response: 400
    - content-type: "text/html"
    - body: (string) "Improperly formatted request, please fix and try again."
- response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied" 
- response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl https://couple-finder.me/api/new-matches -b cookie-file.txt
```

- Description: Gets all incoming and outgoing match requests for the logged in user
- Request: "GET /api/matches/"
- Response: 200
    - content-type: "application/json"
    - body: object
        - incoming: [object] incomming match requests
            - inviter_profile: object
                - bio: (string) bio of the match
                - gender: (string) gender of the match
                - name: (string) name of the match
                - email: (string) email of the match
                - age: (number) age of the match
                - foods_resp: (number) response to food survey question
                - music_resp: (number) response to music survey question
                - personality_resp: (number) response to the personality survey question
                - pets_resp: (number) response to the pets survey question
                - smokes_resp: (number) response to the smokes survey question
                - traits_resp: (number) response to the traits survey question
                - pictures: [object] array containing pictures of the match
                    - filename: (string) randomly generated filename
                    - id: (string) randomly generated id
                    - is_profile_picture: (boolean) true if picture is the profile picture for the match
                    - mimetype: (string) mimetype of the image
                    - path: (string) path of the image on disc
        - outgoing: [object] outgoing match requests
            - invitee_profile: object
                - bio: (string) bio of the match
                - gender: (string) gender of the match
                - name: (string) name of the match
                - email: (string) email of the match
                - age: (number) age of the match
                - foods_resp: (number) response to food survey question
                - music_resp: (number) response to music survey question
                - personality_resp: (number) response to the personality survey question
                - pets_resp: (number) response to the pets survey question
                - smokes_resp: (number) response to the smokes survey question
                - traits_resp: (number) response to the traits survey question
                - pictures: [object] array containing pictures of the match
                    - filename: (string) randomly generated filename
                    - id: (string) randomly generated id
                    - is_profile_picture: (boolean) true if picture is the profile picture for the match
                    - mimetype: (string) mimetype of the image
                    - path: (string) path of the image on disc
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl https://couple-finder.me/api/matches -b cookie-file.txt
```

- Description: Gets all favourite matches for the logged in user
- Request: "GET /api/favourites/"
- Response: 200
    - content-type: "application/json"
    - body: [object]
        - bio: (string) bio of the match
        - gender: (string) gender of the match
        - name: (string) name of the match
        - email: (string) email of the match
        - age: (number) age of the match
        - foods_resp: (number) response to food survey question
        - music_resp: (number) response to music survey question
        - personality_resp: (number) response to the personality survey question
        - pets_resp: (number) response to the pets survey question
        - smokes_resp: (number) response to the smokes survey question
        - traits_resp: (number) response to the traits survey question
        - pictures: [object] array containing pictures of the match
            - filename: (string) randomly generated filename
            - id: (string) randomly generated id
            - is_profile_picture: (boolean) true if picture is the profile picture for the match
            - mimetype: (string) mimetype of the image
            - path: (string) path of the image on disc
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl https://couple-finder.me/api/favourites -b cookie-file.txt
```

### Update
- Description: Create or update filters for the logged in user
- Request: "PUT /api/filters/"
    - Content-type: "application/json"
    - Body: object
        - lower_age_range: (number) preferred minimum age for matches
        - upper_age_range: (number) preferred upper age for matches
        - preferred_gender: (string) preferred gender of matches
        - smokes: (number) preferred smoking frequency for matches
- Response: 200
    - content-type: "application/json"
    - body: object
        - lower_age_range: (number) preferred minimum age for matches
        - upper_age_range: (number) preferred upper age for matches
        - preferred_gender: (string) preferred gender of matches
        - smokes: (number) preferred smoking frequency for matches
- Response: 400
    - content-type: "text/html"
    - body: (string) "A required field is missing, Please add a value for: _field_ and try again"
- Response: 400
    - content-type: "text/html"
    - body: (string) "Invalid value for preferred_gender, please choose from: MALE, FEMALE, BOTH"
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -X PUT -H "Content-Type: application/json" -d '{"lower_age_range": 18, "upper_age_range": 45, "preferred_gender": "FEMALE", "smokes": 1}' https://couple-finder.me/api/filters -b cookie-file.txt
```

- Description: Create or update survey responses for the logged in user
- Request: "PUT /api/survey/"
    - Content-type: "application/json"
    - Body: object
        - foods_resp: (number) answer_number to the food preference question
        - music_resp: (number) answer_number to the music preference question
        - personality_resp: (number) answer_number to the personality question
        - pets_resp: (number) answer_number to the pets preference question
        - smokes_resp: (number) answer_number to the smokes frequency question
        - traits_resp: (number) answer_number to the traits question
- Response: 200
    - content-type: "application/json"
    - body: object
        - foods_resp: (number) answer_number to the food preference question
        - music_resp: (number) answer_number to the music preference question
        - personality_resp: (number) answer_number to the personality question
        - pets_resp: (number) answer_number to the pets preference question
        - smokes_resp: (number) answer_number to the smokes frequency question
        - traits_resp: (number) answer_number to the traits question
- Response: 400
    - content-type: "text/html"
    - body: (string) "A required field is missing, Please add a value for: _field_ and try again"
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -X PUT -H "Content-Type: application/json" -d '{"foods_resp": 1, "music_resp": 1, "personality_resp": 1, "smokes_resp": 1, "pets_resp": 1, "traits_resp": 1}' https://couple-finder.me/api/survey -b cookie-file.txt
```

- Description: Like or dislike a potential profile
- Request: "PUT /api/match/"
    - Content-type: "application/json"
    - Body: object
        - invitee: (string) the email of the liked/disliked profile
        - status: (string) the status of the match request out of PENDING, MATCHED, DISLIKED
- Response: 200
    - content-type: "application/json"
    - body: [object]
        - invitee: (string) the email of the liked/disliked profile
        - inviter: (string) the email of the current user
        - status: (string) the status of the match request out of PENDING, MATCHED, DISLIKED
- Response: 400
    - content-type: "text/html"
    - body: (string) "Improperly formatted request, please fix and try again."
- Response: 400
    - content-type: "text/html"
    - body: (string) "Impropper value for status. Please select one of: PENDING, DISLIKED, MATCHED and try again."
- Response: 401
    - content-type: "text/html"
    - body: (string) "Access Denied"
- Response: 500
    - content-type: "text/html"
    - body: (string) Error message of whatever error occured
```
$ curl -X PUT -H "Content-Type: application/json" -d '{"invitee": "nicole@gmail.com", "status": "PENDING"}' https://couple-finder.me/api/match -b cookie-file.txt
```


### Delete

"use strict";
let rating = 3;
let currentReview = 0;
let imgURI = null;
let reviewStorage = {
    "reviews": []
};
var app = {
    init: function () {
        console.log("here");
        app.drawReviews();
        eventListeners.addEventListeners();
        app.readyStars();
    }
    , drawReviews: function () {
        console.log("draw reviews");
        if (!localStorage.getItem("wagn0070")) {
            localStorage.setItem("wagn0070", JSON.stringify(reviewStorage));
            console.log(localStorage);
        }
        else {
            let list = document.getElementById("list-reviews");
            list.innerHTML = "";
            let savedReviews = JSON.parse(localStorage.getItem("wagn0070"));
            for (let i = 0; i < savedReviews.reviews.length; i++) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                let img = document.createElement("img");
                let div = document.createElement("div");
                li.classList.add("table-view-cell", "media");
                a.classList.add("navigate-right");
                a.setAttribute("href", "#deleteModal");
                a.setAttribute("data-id", savedReviews.reviews[i].id);
                a.addEventListener("touchstart", current.current);
                img.classList.add("media-object", "pull-left");
                img.setAttribute("height", "72");
                img.setAttribute("width", "72");
                img.setAttribute("src", savedReviews.reviews[i].img);
                div.classList.add("media-body");
                div.textContent = savedReviews.reviews[i].name;
                let reviewStars = document.createElement("div");
                for (let q = 0; q < savedReviews.reviews[i].rating; q++) {
                    let span = document.createElement("span");
                    span.classList.add("reviewStars", "star2", "rated");
                    reviewStars.appendChild(span);
                }
                a.appendChild(img);
                div.appendChild(reviewStars);
                a.appendChild(div);
                li.appendChild(a);
                list.appendChild(li);
            }
        }
    }
    , popDelModal: function () {
        let stored = JSON.parse(localStorage.getItem("wagn0070"));
        let delImg = document.getElementById("bigReviewImage");
        for (let f = 0; f < stored.reviews.length; f++) {
            if (currentReview == stored.reviews[f].id) {
                delImg.setAttribute("src", stored.reviews[f].img);
            }
        
    }
    }
    , saveReviews: function () {
        let stored = JSON.parse(localStorage.getItem("wagn0070"));
        console.log(currentReview);
        currentReview == 0;
        if (currentReview == 0) {
            let timeStamp = Date.now();
            let review = {
                "id": timeStamp
                , "name": document.getElementById("name").value
                , "rating": rating
                , "img": imgURI
            };
            stored.reviews.push(review);
            stored = JSON.stringify(stored);
            localStorage.setItem("wagn0070", stored);
            app.cancelReview();
            setTimeout(app.drawReviews, 500);
        }
    }
    , cancelReview: function () {
        document.getElementById("name").value = "";
        document.getElementById("imgModal").src = "";
        rating = 3;
        app.drawReviews();
    }
    , takePhoto: function () {
        navigator.camera.getPicture(app.onSuccess, app.onFail, {
            quality: 80
            , destinationType: Camera.DestinationType.FILE_URI
            , encodingType: Camera.EncodingType.PNG
            , mediaType: Camera.MediaType.PICTURE
            , pictureSourceType: Camera.PictureSourceType.CAMERA
            , allowEdit: true
            , targetWidth: 300
            , targetHeight: 300
            , saveToPhotoAlbum: true
        });
    }
    , onSuccess: function (imageURI) {
        var image = document.getElementById("imgModal");
        image.src = imageURI;
        imgURI = imageURI;
    }
    , onFail: function () {
        alert('Failed because: ' + message);
    }
    , deletePhoto: function () {
        let stored = JSON.parse(localStorage.getItem("wagn0070"));
        for (let k = 0; k < stored.reviews.length; k++) {
            if (currentReview == stored.reviews[k].id) {
                stored.reviews.splice(k, 1);
            }
        }
        stored = JSON.stringify(stored);
        console.log(currentReview);
        console.log(localStorage);
        localStorage.setItem("wagn0070", stored);
        currentReview = 0;
        setTimeout(app.drawReviews, 500);
    }
    , addListeners: function () {
        let stars = document.querySelectorAll('.star');
        console.log("add listeners");
        for (let i = 0; i < stars.length; i++) {
            stars[i].addEventListener('touchend', (function (c) {
                console.log('adding listener', i);
                console.log(rating);
                return function (i) {
                    rating = c + 1;
                    console.log('Rating is now', rating)
                    app.setRating();
                }
            })(i));
        };
    }
    , setRating: function () {
        let stars = document.querySelectorAll('.star');
        console.log("set rating");
        for (let i = 0; i < stars.length; i++) {
            if (rating > i) {
                stars[i].classList.add('rated');
                console.log('added rated on', i);
            }
            else {
                stars[i].classList.remove('rated');
                console.log('removed rated on', i);
            }
        };
    }
    , readyStars: function () {
        console.log("ready stars");
        app.addListeners();
        app.setRating();
    }
}
var eventListeners = {
    addEventListeners: function () {
        document.getElementById("photoBtn").addEventListener("touchend", app.takePhoto);
        document.getElementById("cancelBtn").addEventListener("touchend", app.cancelReview);
        document.getElementById("saveBtn").addEventListener("touchend", app.saveReviews);
        document.getElementById("deleteBtn").addEventListener("touchend", app.deletePhoto);
    }
    , removeEventListeners: function () {
        document.getElementById("photoBtn").removeEventListener("touchend", app.takePhoto);
        document.getElementById("cancelBtn").removeEventListener("touchend", app.cancelReview);
        document.getElementById("saveBtn").removeEventListener("touchend", app.saveReviews);
        document.getElementById("deleteBtn").removeEventListener("touchend", app.deletePhoto);
    }
}
var current = {
    current: function (ev) {
        let x = ev.currentTarget;
        currentReview = x.getAttribute("data-id");
        app.popDelModal();
    }
}
if (document.deviceReady) {
    document.addEventlistener('deviceready', app.init);
}
else {
    document.addEventListener('DOMContentLoaded', app.init)
}
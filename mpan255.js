let loginstats = false;
let loggedusername = "";
let loggedpassword = "";
function hideshow(name){

    document.getElementById("homepage").style.display="none";
    document.getElementById("staffpage").style.display="none";
    document.getElementById("shoppage").style.display="none";
    document.getElementById("registrationpage").style.display="none";
    document.getElementById("bookpage").style.display="none";
    document.getElementById("loginpage").style.display="none";

    if (typeof name === 'string' || name instanceof String){document.getElementById(name).style.display="flex";}else{
        document.getElementById(name.id).style.display="flex";
    }

}


function writecomment(){
    const username = document.getElementById("username").value;
    const comment = document.getElementById("comment").value;
    const combinecomment = {"Comment" : comment,
                            "name" : username
    };
    if (comment == "" || username == ""){
        alert("Comment or username cannot be empty!");
        return;
    }
    const fetchpromise = fetch('http://localhost:5000/api/WriteComment',
    {
        headers : {
            "Content-Type" : "application/json"
        },
        method : "POST",
        body : JSON.stringify(combinecomment)
    }).then(response => {
        alert("Comment has been updated successfully")
    });
    fetchpromise.then((response) => {displaycomment()});

}



const displaycomment = () => {
    const fetchpromise = fetch('http://localhost:5000/api/GetComments',
    {   
        headers : {
            "Accept" : "application/json",
        },
    });
    const streamPromise = fetchpromise.then((response) => response.text());
    streamPromise.then((data) =>  {displaycomment2(data)});
    const displaycomment2 = (data) =>{
        const temp = document.getElementById("CommentContent");
        temp.innerHTML = data;
    }

}


function registration(){
    const username = document.getElementById("rname").value;
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value;
    const combineinfo = {
        "userName": username,
        "password": password,
        "address": address
      };
    if (username == "" || password == ""){
        alert("userName or password cannot be empty!");
        return;
    }




    const fetchpromise = fetch('http://localhost:5000/api/Register',
    {
        headers : {
            "Content-Type" : "application/json"
        },
        method : "POST",
        body : JSON.stringify(combineinfo)
    }).then(response => response.text()).then(data => {
        if (data == "User successfully registered."){
            alert("User successfully registered.");
        }else{
            alert("Username not available.");
        }
    
    });
}




function loginbutton(){

    if (document.getElementById("loginbutton").innerHTML == "click to login"){
        

        hideshow("loginpage");

    }else{
        hideshow("homepage");
        document.getElementById("loginbutton").innerHTML="click to login";
        alert("Logged out");
        loginstats = false;
        loggedusername = "";
        loggedpassword = "";
    }



}

function login(){


        const username = document.getElementById("loginname").value;
        const password = document.getElementById("loginpassword").value;
        fetch("http://localhost:5000/api/GetVersionA", 
    {
        headers : new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(username + ":" + password)
        }),
        method  : "GET",
    }).then(response => {

          if (!response.ok){
              alert("username or password is wrong");
              return;
          }else{
            loginstats = true;
            loggedusername = username;
            loggedpassword = password;
            hideshow("homepage")
            document.getElementById("loginbutton").innerHTML="Logout";
            return;
          }
      });


      
}

const items = () =>{
    document.getElementById("searchbar").style.display = "block";

    const items = fetch("http://localhost:5000/api/GetItems",
    {
        headers : {
            "Accept" : "application/json"
        },
    });
    const itemspromise = items.then((response) => response.json()).then(data => showDetails(data));

}

const showDetails = (data) => {
    let htmlString = "<tr class = 'itemtable'><td>Img</td><td>Itemname</td><td>Description</td><td>Price</td>"

    const showItem = (item) => {
        let newimage = document.createElement("img");
        let div = document.createElement("div");
        let name = document.createElement("h1");
        let des = document.createElement("p");
        let price = document.createElement("h1");
        let button1 = document.createElement("button");
        button1.textContent = "Purchase";
        button1.id = "purchasebutton";
        button1.onclick = () => buy(item.id);
        newimage.id = "itemimg";
        newimage.src = "http://localhost:5000/api/GetItemPhoto/" + item.id;
        name.innerHTML = item.name;
        des.innerHTML = item.description;
        price.innerHTML = item.price;
        div.appendChild(newimage);
        div.appendChild(name);
        div.appendChild(des);
        div.appendChild(price);
        div.appendChild(button1);
        div.id = item.name;
        temp.appendChild(div);
    }
    const temp = document.getElementById("itemtable");
    data.forEach(showItem);
    
}

const buy = (data) =>{
    if (loginstats == false){
        hideshow(loginpage);
        alert("Please login first");
        return;
    }
	const abc = {"productID": data, quantity: 1};
	let temp = fetch("http://localhost:5000/api/PurchaseItem", {
		headers: new Headers({
			"Content-Type": "application/json",
			"Authorization": "Basic " + btoa(loggedusername + ":" + loggedpassword),	
		}),
		method: "POST",
		body: JSON.stringify(abc)
	});
    temp.then(res => {
        if (res.ok){
            alert("purchased");
        }
    });


}

function search(){
    let input = document.getElementById("searchbar").value;
    let items = document.getElementById("itemtable").children;
    for (i = 0; i < items.length; i++){
        if (items[i].id.toLowerCase().includes(input.toLowerCase()) == false){
            document.getElementById(items[i].id).style.display = "none";
        }else{
            document.getElementById(items[i].id).style.display = "block";
        }
    }



}


const staffs = () =>{

    let alist = fetch("http://localhost:5000/api/GetAllStaff").then(res => res.json()).then(data => vcardID(data));


    const vcardID = (data) => {
        for (let i = 0; i < data.length; i++){
            vcardinfo(data[i].id);
        }
    }

    const vcardinfo = (staffid) =>{
        fetch(`http://localhost:5000/api/GetCard/${staffid}`).then(res => res.text()).then(data => vcarddetail(data,staffid))
    }

    const vcarddetail = (vcard,id) =>{


        let name = vcard.slice(vcard.search("FN:")+3, vcard.search("UID")-1);
        let phone = vcard.slice(vcard.search("TEL:")+4,vcard.search("URL")-1);
        let email = vcard.slice(vcard.search("EMAIL;")+10+6,vcard.search("TEL")-1);
        let role = vcard.slice(vcard.search("CATEGORIES:")+"CATEGORIES:".length,vcard.search("PHOTO")-1);
        let photo = vcard.slice(vcard.search("PHOTO;")+6,vcard.search("LOGO;")-1);
        photo = photo.split(":")[1];
        let div = document.createElement("div");
        let phonetext = document.createElement("a");
        let nametext = document.createElement("a");
        let emailtext = document.createElement("a");
        let roletext = document.createElement("p");
        let photoimg = document.createElement("img");
        photoimg.src = "data:image/png;base64, " + photo;
        phonetext.innerHTML = phone;
        nametext.innerHTML=name;
        emailtext.innerHTML=email;
        roletext.innerHTML=role;
        div.id = "staffdiv";
        phonetext.href = "tel:"+phone;
        emailtext.href="mailto:" + email;
        nametext.href ="http://localhost:5000/api/GetCard/"+ id;
        photoimg.className = "staffphoto";
        div.appendChild(photoimg);
        div.appendChild(document.createElement("br"))
        div.appendChild(nametext);
        div.appendChild(document.createElement("br"))
        div.appendChild(emailtext);
        div.appendChild(document.createElement("br"))
        div.appendChild(phonetext);
        div.appendChild(document.createElement("br"))
        div.appendChild(roletext);
        const temp = document.getElementById("stafftable");
        temp.appendChild(div);




    }

}


function clean(){

    document.getElementById("searchbar").value = "";

}









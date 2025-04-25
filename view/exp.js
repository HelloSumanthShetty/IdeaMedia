//const customeAPIError = require("../errors/customeAPIError");
console.log("exp.js loaded");

//fetch make sure no reload happens

window.onload = async () => {
  try {
    const res   = await fetch("/profile_detail");
    const data  = await res.json();

    if (data.error) throw new Error(data.error);

    // set the username
    document.getElementById('username').textContent = data.username;

    // render each post
    const container = document.getElementById('postcontainer');
    container.innerHTML = "";  // clear any old datas
//the posts now has both object and the content 
    data.posts.forEach(post => {
      const card = document.createElement('div');
      card.className = " p-4 rounded-md border bg-zinc-700 text-white";
   
      card.innerHTML = `
        <h2 class="text-xl text-blue-400 mb-2">@${post.username}</h2>
        <p class="text-sm tracking-tight mb-3">${post.content}</p>
        <div class="flex space-x-4 text-sm">
          <a href="#" class="text-blue-400 like-btn">Like (${post.likes})</a>
          <a href="#" class="text-zinc-300">Edit</a>
        </div>
      `;
      const likebtn=card.querySelector('.like-btn')
      likebtn.addEventListener("click",async()=>{
        const res = await fetch(`/api/like/${post._id}`, { method: "POST" });

        const data=await res.json()
        if(data.success){
          likebtn.textContent=`like (${data.likes})`
        }
      })

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert("Session expired, redirecting…");
    setTimeout(() => window.location.href = '/login', 2000);
  }
};

//res.json don't exit in browser it only exist in node.js which is why it's don't use res.json instread use console.error()
 
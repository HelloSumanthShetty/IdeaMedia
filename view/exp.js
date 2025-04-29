window.onload = async () => {
  console.log("please work");


  
  try {

    const renderPostB=async(url)=>{
      

      const res = await fetch(url);
      const data = await res.json();
  
      //console.log("Fetched data:", data);
  
      if (data.error) throw new Error(data.error);
      
        document.getElementById('username').textContent = "Global Feed";
      
      const formatDate = (dt) => {
        const option = {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,   
        };
        return new Date(dt).toLocaleString('en-GB', option); 
      };
      
      const container = document.getElementById('postcontainer');
      container.innerHTML = "";
   
      //  Loop through and render each post
      data.posts.forEach(post => {
        const card = document.createElement('div');
        card.className = "p-4 rounded-md border bg-zinc-700 text-white";
  
        // Set innerHTML first before querying elements inside
        card.innerHTML = `
          <h2 class="text-xl text-blue-400 mb-2">@${post.username}</h2>
          <p class="text-sm tracking-tight mb-3">${post.content}</p>
          <div class="flex space-x-4 text-sm">
            <a href="#" class=" text-zinc-100 like-btn">Like (${post.likes})</a>
            <a href="#" class="text-zinc-300">Edit</a>
            <a href="#" class="text-zinc-300">delete</a>
          </div>
          <p class="text-sm text-zinc-400 mt-3">${formatDate(post.date)}</p>
        `;
      
        const likeBtn = card.querySelector('.like-btn');
        console.log("i"+post.userid)
        for(let i=0;i<=post.likedby.length;i++){ 
        if(post.userid==post.likedby[i]){
         
         console.log("3"+post.likedby);
          
          likeBtn.classList.remove("text-zinc-100")
          likeBtn.classList.add("text-green-600")
        } 
      }
  
        likeBtn.addEventListener("click", async (e) => {
          e.preventDefault();
      
          try {
            
            
            const res = await fetch(`/api/like/${post._id}`, { method: "POST" });
            
            const result = await res.json();
            
            if (!result.islikedbycurrentuser) {
              likeBtn.classList.remove("text-zinc-100"); // Assuming text-zinc-100 is the default
            likeBtn.classList.add("text-green-600"); // Add the blue/liked color
              }
            if (result.success) {
              likeBtn.textContent = `Like (${result.likes})`;
           
            }
            if(likeBtn.classList.contains("text-zinc-100")){
              likeBtn.classList.remove("text-zinc-100")
              likeBtn.classList.add("text-green-600")
            } 
            else{
              likeBtn.classList.remove("text-green-600")
              likeBtn.classList.add("text-zinc-100")
            }
        
            
          } catch (error) {
            console.error("Error liking post:", error);
          }
        });
  
        container.appendChild(card);
      
      });
    }
    //  Clear previous posts
    const renderPostA=async(url)=>{
      

    const res = await fetch(url);
    const data = await res.json(); 

    //console.log("Fetched data:", data);

    if (data.error) throw new Error(data.error);
    
    if (data.username) {
      document.getElementById('username').textContent = data.username;
    }   
   

    const formatDate = (dt) => {
      const option = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,   
      };
      return new Date(dt).toLocaleString('en-GB', option); 
    };
    
    const container = document.getElementById('postcontainer');
    container.innerHTML = "";
 
    //  Loop through and render each post
    data.posts.forEach(post => {
      const card = document.createElement('div');
      card.className = "p-4 rounded-md border bg-zinc-700 text-white";

      // Set innerHTML first before querying elements inside
      card.innerHTML = `
        <h2 class="text-xl text-blue-400 mb-2">@${data.username}</h2>
        <p class="text-sm tracking-tight mb-3">${post.content}</p>
        <div class="flex space-x-4 text-sm">
          <a href="#" class=" space-r-4 text-zinc-100 like-btn">Like (${post.likes})</a>
          <a href="#" class="text-zinc-100">Edit</a>
         <a href="#" class="text-zinc-100">delete</a>
          </div>
        <p class="text-sm text-zinc-400 mt-3">${formatDate(post.date)}</p>
      
        `;
        
      
      const likeBtn = card.querySelector('.like-btn');
     for(let i=0;i<=post.likedby.length;i++){ 
      if(post.user==post.likedby[i]){
      //   console.log("i"+post.user)
      //  console.log("2"+post.likedby);
        
        likeBtn.classList.remove("text-zinc-100")
        likeBtn.classList.add("text-green-600")
      }
    }
    

      likeBtn.addEventListener("click", async (e) => {
        e.preventDefault();
    
        try {
          
          const res = await fetch(`/api/like/${post._id}`, { method: "POST" });
          
          const result = await res.json();
         
          if (!result.islikedbycurrentuser) {
            likeBtn.classList.remove("text-zinc-100"); // Assuming text-zinc-100 is the default
          likeBtn.classList.add("text-green-600"); // Add the blue/liked color
            }
     

          if (result.success) {
            likeBtn.textContent = `Like (${result.likes})`;
         
          }
          
          if(likeBtn.classList.contains("text-zinc-100")){
            likeBtn.classList.remove("text-zinc-100")
            likeBtn.classList.add("text-green-600")
          }
          else{
            likeBtn.classList.remove("text-green-600")
            likeBtn.classList.add("text-zinc-100")
          } 
      
          
        } catch (error) {
          console.error("Error liking post:", error);
        }
      });

      container.appendChild(card);
    
    });
  }
  
  
  const profilebtn=document.getElementById("profileBtn").addEventListener("click",()=>renderPostA("/profile_detail"))
 const globalbtn=document.getElementById("globalBtn").addEventListener('click',()=>renderPostB("/getall_detail"))
 renderPostA("/profile_detail")
 
} catch (err) {
    console.error("Client error:", err.message);
    alert("Error has occurred: " + err.message);
    setTimeout(() => window.location.href = '/login', 2000);
  }
};
 
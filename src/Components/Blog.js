//Blogging App using Hooks
import  { useState, useRef,useEffect, useReducer } from 'react';
import {db} from "../firebaseinit";
import { collection, addDoc , doc,setDoc, getDocs,deleteDoc} from "firebase/firestore"; 


function blogsReducer(state, action){

    switch(action.type){

        case "GET":
            return [...action.blogs];
        case "ADD":
            return [action.blog, ...state];
        case "REMOVE":
            return state.filter((blog)=> blog.id !== action.blogId);
        default:
            return state;
    }
}


export default function Blog(){
    
    // const[title,setTitle] = useState("");
    // const[content, setContent] = useState("");

    const[formData, setFormData] = useState({title:"",content:""});
    // const[blogs, setBlogs] = useState([]);
    const [blogs, dispatch] = useReducer(blogsReducer, []);
    const titleRef = useRef(null);

    useEffect(()=>{
        titleRef.current.focus();
    },[]);

    useEffect(()=>{
        if(blogs.length && blogs[0].title){
            document.title = blogs[0].title;
        }else{
            document.title = "No Blog!"
        }
    },[blogs]);

    useEffect(() => {
        
        /*********************************************************************** */
        /** get all the documents from the fireStore using getDocs() */ 
        /*********************************************************************** */
        async function fetchData(){
            const snapShot =await getDocs(collection(db, "Blogs App"));
            console.log(snapShot);

            const blogs = snapShot.docs.map((doc) => {
                return{
                    id: doc.id,
                    ...doc.data()
                }
            })
            console.log(blogs);
            // setBlogs(blogs);
            dispatch({type:"GET",blogs});

        }

        fetchData();
        /*********************************************************************** */
    },[]);



    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();
        // setBlogs([{title:formData.title, content:formData.content},...blogs]);
        dispatch({type:'ADD',blog:{title: formData.title , content : formData.content}});
        setFormData({title:"",content:""});
        titleRef.current.focus();
        console.log(formData.content +""+ formData.title);

        // Add a new document with a generated id.
        const docRef = doc(collection(db, "Blogs App"));
        await setDoc(docRef, {
               name: formData.title,
              country: formData.content,
              time : new Date()
         });
        
        //  console.log("Document written with ID: ", docRef.id);
  
    }

    async function removeBlog(id){
        // setBlogs(blogs.filter((blog,index) => i !==index));
        await deleteDoc(doc(db,"Blogs App",id));
        dispatch({ type :"REMOVE" ,  blogId:id}) ;
        
    }

    return(
        <>
        {/* Heading of the page */}
        <h1>Write a Blog!</h1>

        {/* Division created to provide styling of section to the form */}
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>

                {/* Row component to create a row for first input field */}
                <Row label="Title">
                        <input className="input"
                                placeholder="Enter the Title of the Blog here.."
                                value={formData.title}
                                ref={titleRef}
                                required
                                 onChange={(e) => setFormData({title:e.target.value, content:formData.content})}/>
                </Row >

                {/* Row component to create a row for Text area field */}
                <Row label="Content">
                        <textarea className="input content"
                                placeholder="Content of the Blog goes here.."
                                value={formData.content}
                                required
                                 onChange={(e)=> setFormData({title:formData.title, content:e.target.value})}/>
                </Row >

                {/* Button to submit the blog */}            
                <button className = "btn">ADD</button>
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}
        <h2> Blogs </h2>
        {blogs.map((blog, i)=>(
            <div className='blog' key={i}>
                <h3>{blog.name}</h3>
                <p>{blog.country}</p>
                <div className='blog-btn'>
                <button className='remove btn' onClick={()=> removeBlog(blog.id)}>Delete</button>
                </div>
            </div>
        ))}
        
        </>
        )
    }

//Row component to introduce a new row section in the form
function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}

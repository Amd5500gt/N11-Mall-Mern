import React from 'react'
import { createContext,useEffect,useState,useContext } from 'react'
import toast from 'react-hot-toast';
 const SearchContext = createContext()

export const SearchProvider = ({children}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skip, setSkip] = useState(0);
    const [filterData, setFilterData] = useState([])
    const [total, setTotal] = useState(0);
    const limit = 12;
    const [searchTerm, setSearchTerm] = useState("")
    const [token,setToken] = useState(localStorage.getItem("jwtToken"));
    const [userData,setUserData] = useState(null);
    const isLogged = !!token;
    const [userName,setUserName] = useState(null)
    const [userEmail,setUserEmail] = useState(null)
    useEffect(() => {
      setLoading(true);
    
      fetch("http://localhost:8080/products", {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      })
        .then(res => {
          if (!res.ok) throw new Error("API Error");
          return res.json();
        })
        .then(json => {
          setData(json.products || []);
          setFilterData(json.products || []);
          setTotal(json.total || 0);
        })
        .catch(err => {
          console.log(err);
          setData([]);
          setFilterData([]);
          setTotal(0);
        })
        .finally(() => setLoading(false));
    
    }, []);

useEffect(() => {
  if (token) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
      if(localStorage.getItem("welcomeToastShown") !== "true") {
        toast.success(`Welcome back, ${user.name}!`);
        localStorage.setItem("welcomeToastShown", "true");
      }
  
    }
  }
}, [token]);

  const handleLogout = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("loggedInUser");

  setToken(null);
  setUserData(null);
  setUserName(null);
  setUserEmail(null);

  toast.success("Logged out successfully");
};
  return (
   <SearchContext.Provider value={ {searchTerm,setSearchTerm,data,filterData,total,loading,skip,limit,setData,setLoading,setSkip,setFilterData,setTotal,isLogged,userName,userEmail,handleLogout,setToken,setUserName,setUserEmail} } >
   {children}
   </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)
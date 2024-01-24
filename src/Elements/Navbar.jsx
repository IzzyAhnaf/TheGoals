import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { GoTrash } from "react-icons/go";
import { FiCheckSquare } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import '../Navbar.css'
import { onValue, push, ref, remove } from "firebase/database";
import { db } from "../firebaseConfig";


const Navbar = ({newProfile, setNewProfile, RemoveProfile, setRemoveProfile, setProfileId, idToRemove}) => {
    const [dropdownProfile, setDropdownProfile] = useState(false);
    const [buttonIndex, setButtonIndex] = useState(JSON.parse(sessionStorage.getItem('buttonIndex')) || 1);
    const [ProfileList, setProfileList] = useState([]);
    const [Profile, setProfile] = useState(localStorage.getItem('profile') || 'User');
    const navigate = useNavigate();

    const handleNewProfile = () => {
        const newProfile = document.getElementById("newProfile");
        const Ref = ref(db, "Profiles");

        const data = {
            name: newProfile.value,
        }

        push(Ref, data).then(() => {
            setNewProfile(!newProfile)
        }).catch((error) => {
            console.log(error)
        })
    }

    const GetProfile = async () => {
        const Ref = ref(db, "Profiles");

        onValue(Ref, (snapshot) => {
            const data = snapshot.val();

            if(data !== null){
                const newProfileList = Object.keys(data).map((key) => {
                    return{
                        id: key,
                        name: data[key].name
                    }
                });

                setProfileList((prevProfileList) => {
                  const uniqueProfileList = Array.from(new Set([...newProfileList]));
          
                  return uniqueProfileList;
                });
            }
        })
    }

    const hSetProfile = (profile, id) => {
        localStorage.setItem('profile', profile);
        localStorage.setItem('profileId', id);
        setProfile(profile)
        setProfileId(id)
    }

    const hSetButtonIndex = (index) => {
        sessionStorage.setItem('buttonIndex', index);
        setButtonIndex(index)
    }

    const hRemoveProfile = () => {
            const indexToRemove = ProfileList.findIndex((profile) => profile.id === idToRemove);
        
            if (indexToRemove !== -1) {
            const updatedProfileList = [...ProfileList];
            updatedProfileList.splice(indexToRemove, 1);
            setProfileList(updatedProfileList);
        
            if (updatedProfileList.length > 0) {
                const firstProfile = updatedProfileList[0];
                localStorage.setItem('profile', firstProfile.name);
                localStorage.setItem('profileId', firstProfile.id);
                setProfile(firstProfile.name);
                setProfileId(firstProfile.id);
            } else {
                localStorage.removeItem('profile');
                localStorage.removeItem('profileId');
                setProfile(null);
                setProfileId('');
            }
        
            const Ref = ref(db, "Profiles/" + idToRemove);
            const cardRef = ref(db, "Cards - " + idToRemove);
          
            onValue(cardRef, (snapshot) => {
                const data = snapshot.val();
                if(data !== null){
                    const newCardList = Object.keys(data).map((key) => {
                        return{
                            id: key
                        }
                    })
                    newCardList.forEach((card) => {
                        const checklistRef = ref(db, `CheckList - ${card.id}`);
                        remove(checklistRef)
                    })
                }
            })
            remove(Ref).then(() => {
                remove(cardRef).then(() => {
                    setRemoveProfile(!RemoveProfile);
                    navigate(0);
                })
            })
        } else {
          console.error('Profil tidak ditemukan dalam daftar.');
        }
      };
      

    useEffect(() => {
       GetProfile() 
    },[])

    return(
        <>
            <nav className="bg-white border-gray-200 px-2 sm:px-4 py-5 text-md dark:bg-gray-900" style={{borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px', filter: newProfile ? 'blur(5px)' : 'none'}}>
                <div className="flex justify-between text-black dark:text-white px-5">
                    <div className="flex space-x-4 p-2 font-medium">
                        <NavLink className={`flex justify-center items-center p-1`} onClick={() => hSetButtonIndex(1)}
                        style={{borderBottomColor: buttonIndex === 1 ? 'white' : 'transparent', borderBottomWidth: buttonIndex === 1 ? '2px' : '0px',
                        borderBottomStyle: buttonIndex === 1 ? 'solid' : 'none', animation: buttonIndex === 1 ? 'buttonIndex 0.25s ease-in-out' : 'none'}}
                         to={'/'}><span className="mr-1"><FiCheckSquare/></span>Goals</NavLink>
                         
                        <NavLink to={'/Trash'} onClick={() => hSetButtonIndex(2)} className={`flex justify-center items-center p-1`}
                        style={{borderBottomColor: buttonIndex === 2 ? 'white' : 'transparent', borderBottomWidth: buttonIndex === 2 ? '2px' : '0px',
                        borderBottomStyle: buttonIndex === 2 ? 'solid' : 'none', animation: buttonIndex === 2 ? 'buttonIndex 0.25s ease-in-out' : 'none'}}><span className="mr-1"><GoTrash/></span>Trash</NavLink>
                    </div>
                    <div className="relative inline-block font-medium group container w-1/6 text-center p-2">
                        <button className="p-1" onClick={() => setDropdownProfile(!dropdownProfile)}
                        style={{borderBottomColor: buttonIndex === 3 ? 'white' : 'transparent', borderBottomWidth: buttonIndex === 3 ? '2px' : '0px',
                        borderBottomStyle: buttonIndex === 3 ? 'solid' : 'none', animation: buttonIndex === 3 ? 'buttonIndex 0.25s ease-in-out' : 'none'}}>
                        {Profile}
                        </button>

                        <div className={`absolute container bg-white dark:bg-gray-900 py-4 right-0`}
                        style={{borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px', height: 'fit-content',
                        display: dropdownProfile ? 'block' : 'none',
                        animation: dropdownProfile ? 'dropDownProfile 1s forwards' : 'nonedropDownProfile 1s forwards', zIndex: 2}}>
                            {ProfileList.map((profile, index) => (
                            <p key={index} className="hover:text-gray-500 cursor-pointer mb-2"
                            style={{animation: !dropdownProfile ? 'nonemenu 1.25s forwards' : ''}} onClick={() => {setDropdownProfile(!dropdownProfile);hSetProfile(profile.name, profile.id);}}>{profile.name}</p>
                            ))}

                            <NavLink to={'/Profile'} className='hover:text-gray-500 flex items-center justify-center'
                            style={{animation: !dropdownProfile ? 'nonemenu 1.25s forwards' : ''}}
                            onClick={() => {setDropdownProfile(!dropdownProfile);hSetButtonIndex(3)}}><span className="mr-1"><CgProfile/></span>Profile</NavLink>

                            <p className="mt-2 hover:text-gray-500 cursor-pointer flex items-center justify-center" onClick={() => {setNewProfile(true);setDropdownProfile(!dropdownProfile)}}
                            style={{animation: !dropdownProfile ? 'nonemenu 1.25s forwards' : ''}}><span className="mr-1"><IoAddCircleOutline/></span>Add New Profile</p>

                            <hr className="w-2/3 mx-auto my-4"
                            style={{animation: dropdownProfile ? 'menu 1.25s forwards' : 'nonemenu 0.5s forwards'}}/>

                            <span className="flex justify-center items-center space-x-1 text-red-500 hover:text-red-400 cursor-pointer"
                            style={{animation: dropdownProfile ? 'menu 1.25s forwards' : 'nonemenu 0.5s forwards'}}
                            onClick={() => {setRemoveProfile(!RemoveProfile);setDropdownProfile(!dropdownProfile)}}><GoTrash/> <p>Remove Profile</p></span>
                        </div>
                    </div>
                </div>
            </nav>

            {newProfile && (
                <div className="w-1/3 right-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 dark:text-white text-black p-4 rounded-2xl" style={{zIndex: 3}}>
                    <div className="flex justify-between">
                        <h2>Add New Profile</h2><button type="button" className="hover:bg-gray-500 p-1 font-medium" onClick={() => setNewProfile(!newProfile)}>X</button>
                    </div>
                    <hr className="mx-auto my-4"/>
                    <div className="flex flex-col items-center">
                        <input type="text" name="" id="newProfile" className="p-2 w-1/2 rounded bg-gray-500 dark:bg-gray-600 placeholder:text-center text-center focus:ring-0 text-black dark:text-white" placeholder="Profile Name" />
                        <button type="button" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => handleNewProfile()}>Add</button>
                    </div>
                </div>
            )}

            {RemoveProfile && (
                <div className="w-1/3 right-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 dark:text-white text-black p-4 rounded-2xl" style={{zIndex: 3}}>
                    <div className="flex justify-between">
                        <h2>Remove Profile</h2>
                        <button type="button" className="hover:bg-gray-500 p-1 font-medium" onClick={() => setRemoveProfile(!RemoveProfile)}>X</button>
                    </div>
                    <hr className="mx-auto my-4"/>
                    <p className="text-center">Are You Sure You Want To Remove This Profile?</p>
                    <div className="flex justify-center space-x-2">
                        <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4">Cancel</button>
                        <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => hRemoveProfile()}>Remove</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
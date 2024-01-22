import { GoTrash } from "react-icons/go";
import { FiCheckSquare, FiEdit } from "react-icons/fi";
import { TbPin, TbPinnedOff } from "react-icons/tb";
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { onValue, push, ref, remove, set, update } from "firebase/database";
import { db } from "../firebaseConfig";

const CardBox = ({item, closeCard}) => {
    const [AddChecklist, setAddChecklist] = useState(false);
    const [Checklist, setChecklist] = useState([]);
    const [AddItem, setAddItem] = useState(0);
    const [editTitle, setEditTitle] = useState(false)
    const [editDesc, setEditDesc] = useState(false)
    const [editChecklist, setEditChecklist] = useState(false)
    const [editChecklistItem, setEditChecklistItem] = useState(false)
    const IdProfile = localStorage.getItem('profileId');

    // function Card
    const pinCard = () => {
        const Ref = ref(db, `Cards - ${IdProfile}/${item.id}`);
        update(Ref, {
            pin: !item.pin
        }).then(() => {
            closeCard()
        }).catch((error) => {
            console.log(error)
        })
    }

    const removeCard = () => {
        const Ref = ref(db, `Cards - ${IdProfile}/${item.id}`);
        const Ref2 = ref(db, `CheckList - ${item.id}`);
        remove(Ref).then(() => {
            remove(Ref2).then(() => {
                closeCard()
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    // function CheckList
    const handleAddChecklist = () => {
        const Checklist = document.getElementById("Checklist");
        const Ref = ref(db, `CheckList - ${item.id}`);

        const data = {
            title: Checklist.value,
            item: '',
        }

        push(Ref, data).then(() => {
            setAddChecklist(!AddChecklist)
        }).catch((error) => {
            console.log(error)
        })
        setAddChecklist(!AddChecklist)
    }

    const getCheckList = () => {
        const Ref = ref(db, `CheckList - ${item.id}`);

        onValue(Ref, (snapshot) => {
            const data = snapshot.val();
            if(data !== null){
                const newCheckList = Object.keys(data).map((key) => {
                    return{
                        id: key,
                        title: data[key].title,
                        item: data[key].item
                    }
                })

                setChecklist((prevCheckList) => {
                  const uniqueCheckList = Array.from(new Set([...newCheckList]));

                  return uniqueCheckList
                })
            }
        })
    }

    const removeCheckList = (id) => {
        const Ref = ref(db, `CheckList - ${item.id}/${id}`);
        remove(Ref)
    }

    // function Edit
    const editTitleCard = () => {
        const Title = document.getElementById("Title");
        const Ref = ref(db, `Cards - ${IdProfile}/${item.id}`);

        const data = {
            title: Title.value
        }

        update(Ref, data).then(() => {
            setEditTitle(!editTitle)
            item.title = Title.value
        })
    }

    const editDescCard = () => {
        const Desc = document.getElementById("description");
        const Ref = ref(db, `Cards - ${IdProfile}/${item.id}`);

        const data = {
            description: Desc.value
        }

        update(Ref, data).then(() => {
            setEditDesc(!editDesc)
            item.description = Desc.value
        })
    }

    // function CheckItem
    const addcheckitem = (idCard, idCheckList) => {
        const Item = document.getElementById("Item").value;
        const Ref = ref(db, `CheckList - ${idCard}/${idCheckList}/item/`);

        const data = {
            [Item] : false
        };

        set(Ref, data).then(() => {
            setAddItem(!AddItem)
        }).catch((error) => {
            console.log(error)
        })
        document.getElementById("Item").value = '';
    }

    const checkitem = (idCheckList, idCard, keyitem, value) => {
        const Ref = ref(db, `CheckList - ${idCard}/${idCheckList}/item/`);
        update(Ref, {
            [keyitem]: value ? false : true 
        })        
    }

    const removeItem = (idCheckList, idCard, keyitem) => {
        const Ref = ref(db, `CheckList - ${idCard}/${idCheckList}/item/`);
        remove(Ref, keyitem)
    }

    useEffect(() => {
        getCheckList()
    },[])
    return(
        <>
            <div className="bg-gray-500 dark:bg-gray-600 p-5 m-4 rounded-3xl text-black dark:text-white w-1/2 focus:outline-none
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{zIndex: 3, filter: 'blur(0px)', height: '90vh'}}>
                <div className="flex justify-between">
                    {editTitle ? (
                        <div className="flex space-x-2">
                            <input className="bg-gray-200 dark:bg-gray-700 p-2 rounded-3xl ps-4 text-center" id="Title" style={{width: '400px'}}
                            type="text" defaultValue={item.title}/>
                            <button className="hover:text-red-400 p-1 font-medium" onClick={() => setEditTitle(!editTitle)}>X</button>
                            <button className="hover:text-green-400" onClick={() => editTitleCard()}><FiCheckSquare/></button>
                        </div>
                    ):(
                        <h1 className="text-4xl font-semibold">{item.title}</h1>
                    )
                    }
                    <button className="hover:bg-gray-500 p-1 font-medium" onClick={() => closeCard()}>X</button>
                </div>
                <hr className="my-4"/>
                <div className="flex">
                    <div className="w-3/4 overflow-y-auto" style={{maxHeight: '77.5vh'}}>
                        <p className="text-2xl">Description</p>
                        {editDesc ? (
                        <>
                        <textarea className="mt-2 bg-gray-500 dark:bg-gray-700 p-3 focus:outline-none" defaultValue={item.description}
                        style={{resize: 'none'}} id="description" cols="95" rows="8"></textarea>
                        <div className="flex justify-end space-x-2">
                            <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setEditDesc(!editDesc)}>Cancel</button>
                            <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={editDescCard}>Save</button>
                        </div>
                        </>
                        ) : (
                        <p className="mt-2 text-lg text-gray-400">{item.description}</p>
                        )
                        }
                        <hr className="my-4" style={{width: '95%'}}/>
                        <p className="mb-6 text-xl">Checklist</p>
                        {
                            Array.isArray(Checklist) && Checklist.length > 0 && Checklist.map((check, index) =>(
                              <div key={index}>
                                <div className="flex justify-between items-center">
                                    {editChecklist ? (
                                        <div>
                                            <input type="text" id="CheckListTitle" defaultValue={check.title} 
                                            className="focus:outline-none bg-gray-500 dark:bg-gray-700 p-2 rounded-3xl ps-4"/>
                                        </div>
                                    ) : (
                                        <p className="mt-6 text-xl text-gray-400 cursor-default" onClick={() => setEditChecklist(!editChecklist)}>{check.title}</p>
                                    )}
                                    <GoTrash size={20} className="text-red-500 cursor-pointer mt-8" onClick={() => removeCheckList(check.id)}/>
                                </div>
                                <div className="flex flex-col">
                                    {check.item && Object.entries(check.item).map(([key, value]) => 
                                    <div className="flex justify-between items-center" style={{width: '95%'}}>
                                        <div className="flex space-x-1 items-center">
                                            <FiCheckSquare size={20} className={`${value === true ? "text-green-500" : "text-gray-300"}`}
                                            onClick={() => checkitem(check.id, item.id, key, value)}/> <p className="text-lg cursor-default" onClick={() => checkitem(check.id, item.id, key, value)}>{`${key}`}</p>
                                        </div>
                                        <GoTrash size={20} className="text-red-500 cursor-pointer" onClick={() => removeItem(check.id, item.id, key)}/>
                                    </div>
                                    )}
                                    {
                                        AddItem === check.id && (
                                            <>
                                            <input type="text" name="Item" id="Item"
                                            className="p-1 rounded bg-gray-500 dark:bg-gray-500 ps-4 pe-4 focus:outline-none w-1/3 text-black dark:text-white mt-2"/>
                                            </>
                                        )
                                    }
                                </div>
                                {AddItem === check.id ? (
                                <div className="flex items-center space-x-2">
                                    <button type="button" className="hover:bg-blue-700 p-2 font-medium bg-blue-500 rounded-md mt-2" onClick={() => addcheckitem(item.id, check.id)}>Add</button>
                                    <button type="button" className="hover:bg-red-700 p-2 font-medium bg-red-500 rounded-md mt-2" onClick={() => setAddItem(0)}>Cancel</button>
                                </div>
                                ):(
                                <button className="hover:bg-gray-700 p-2 font-medium bg-gray-500 rounded-md mt-2" onClick={() => setAddItem(check.id)}>Add an Item</button>
                                )
                                }
                              </div>  
                            ))
                        }
                        {AddChecklist && (
                            <>
                            <input type="text" name="Checklist" id="Checklist" 
                            className="p-2 rounded bg-gray-500 dark:bg-gray-500 ps-4 pe-4 focus:outline-none text-black dark:text-white mt-6"
                            style={{width: '95%'}}
                            />
                            <div className="flex justify-end mr-9 space-x-2">
                                <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 flex justify-center items-center" onClick={() => setAddChecklist(!AddChecklist)}>Cancel</button>
                                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex justify-center items-center" 
                                onClick={() => handleAddChecklist()}>
                                <IoAddCircleOutline className="mr-1"/>Add</button>
                            </div>
                            </>
                        )}
                    </div>
                    <div className="w-1/4 flex items-center flex-col space-y-4" style={{height: '50vh'}}>
                        <p>Tools</p>
                        <button type="button" className="bg-blue-500 p-3 w-3/4 rounded-full justify-center items-center flex" onClick={() => setAddChecklist(!AddChecklist)}>
                        <FiCheckSquare className="mr-1"/>Add Checklist</button>
                        <button type="button" className="bg-gray-500 p-3 w-3/4 rounded-full flex justify-center items-center"  onClick={() => setEditDesc(!editDesc)}><FiEdit className="mr-1"/>Edit Description</button>
                        <button type="button" className="bg-gray-500 p-3 w-3/4 rounded-full flex justify-center items-center" onClick={() => setEditTitle(!editTitle)}><FiEdit className="mr-1"/>Edit Title</button>
                        <button type="button" className="bg-yellow-500 p-3 w-3/4 rounded-full flex justify-center items-center" onClick={() => pinCard()}><TbPin className="mr-1" />Pin</button>
                        <button type="button" className="bg-red-500 p-3 w-3/4 rounded-full flex justify-center items-center" onClick={() => removeCard()}><GoTrash className="mr-1"/>Delete Card</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardBox
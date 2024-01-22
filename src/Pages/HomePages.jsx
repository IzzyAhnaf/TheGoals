import { TbPin, TbPinnedOff } from "react-icons/tb";
import { onValue, push, ref, update } from "firebase/database"
import { useEffect, useState } from "react"
import { TypeAnimation } from "react-type-animation"
import { db } from "../firebaseConfig"
import CardBox from "../Elements/CardBox"
import { GoTrash } from "react-icons/go";
import RemoveCardBox from "../Elements/RemoveCardBox";

const HomePages = ({addCard, setAddCard, OpenCard, setOpenCard, ProfileId}) => {
    const [Card, setCard] = useState([]);
    const [dataCardBox, setdataCardBox] = useState([])
    const [showSubToolsCard, setShowSubToolsCard] = useState(0)
    const [removeCard, setRemoveCard] = useState(false)

    // function AddCard
    const handleAddCard = () => {
        const id = localStorage.getItem('profileId');
        const Card = document.getElementById("Card");
        const Ref = ref(db, `Cards - ${id}`);

        const data = {
            title: Card.value,
            description: '',
            pin: false,
            complete: false,
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        }

        push(Ref, data).then(() => {
            setAddCard(!addCard)
        }).catch((error) => {
            console.log(error)
        })
    }

    const getAddCard = (id) => {
        const Ref = ref(db, `Cards - ${id}`);

        onValue(Ref, (snapshot) => {
            const data = snapshot.val();
            if(data !== null){
                const newCardList = Object.keys(data).map((key) => {
                    return{
                        id: key,
                        title: data[key].title,
                        description: data[key].description,
                        pin: data[key].pin,
                        complete: data[key].complete,
                        date: data[key].date
                    }
                })

                setCard((prevCardList) => {
                  const uniqueCardList = Array.from(new Set([...newCardList]));

                  return uniqueCardList
                });
            }else{
                setCard([])
            }
        })
    }

    // function PinCard
    const unpinCard = (item) => {
        const Ref = ref(db, `Cards - ${ProfileId}/${item.id}`);
        update(Ref, {
            pin: !item.pin
        }).then(() => {

        }).catch((error) => {
            console.log(error)
        })
    }

    const pinCard = (item) => {
        const Ref = ref(db, `Cards - ${ProfileId}/${item.id}`);
        update(Ref, {
            pin: !item.pin
        }).then(() => {

        }).catch((error) => {
            console.log(error)
        })
    }

    // function EnterCard and LeaveCard
    const enterCard = (id) => {
        setShowSubToolsCard(id);
    }

    const leaveCard = () => {
        setShowSubToolsCard(0);
    }

    // function Close and Open Card
    const openCard = (item) => {
        setOpenCard(true);
        setdataCardBox(item);
    }

    const closeCard = () => {
        setOpenCard(false);
        setdataCardBox([]);
    }

    const openRemoveCard = (item) => {
        setRemoveCard(true);
        setdataCardBox(item);
    }

    useEffect(() => {
        getAddCard(ProfileId)
    }, [ProfileId])
    return(
        <>
            <div style={{filter: addCard || OpenCard ? 'blur(5px)' : 'none'}}>
                <TypeAnimation
                sequence={["Welcome To GoalsKu", 1000, "Here You Can Create, Edit, And Delete Your Goals", 1000, "Reach Your Goals!", 1000]}
                wrapper="h1"
                speed={50}
                cursor={true}
                repeat={Infinity}
                className="text-3xl text-black dark:text-white font-medium"
                style={{fontFamily: 'Montserrat'}}
                />

                <div className="flex justify-between dark:text-white text-black" style={{height: '85.25vh'}}>
                    <div className="w-3/4 mt-4 overflow-y-auto" style={{maxHeight: '74.35vh'}}>
                    {Card && Card.map((card) => (
                        <div key={card.id} className="bg-gray-700 p-5 m-4 rounded-3xl cursor-pointer"
                        onMouseEnter={() => enterCard(card.id)} onMouseLeave={leaveCard}>
                            <div className={`flex ${showSubToolsCard === card.id ? 'justify-between' : 'justify-start'}`}>
                                <div className="w-full pt-2 pb-2" onClick={() => openCard(card)}>
                                    <h2>{card.title}</h2>
                                </div>
                                {
                                    showSubToolsCard === card.id && (
                                    <div className="flex items-center space-x-2">
                                        {!card.pin ? (
                                            <TbPin className="text-gray-400 cursor-pointer hover:text-gray-500" size={25} onClick={() => unpinCard(card)}/>
                                        ) : (
                                            <TbPinnedOff className="text-gray-400 cursor-pointer hover:text-gray-500" size={25} onClick={() => pinCard(card)}/>
                                        )
                                        }
                                        <GoTrash className="text-red-400 cursor-pointer hover:text-red-500" size={25} onClick={() => openRemoveCard(card)}/>
                                    </div>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                    </div>
                    <div className="w-1/4 mt-4 flex flex-col bg-gray-700 p-5 m-4 rounded-3xl" style={{maxHeight: '50vh'}}>
                        <button type="button" className="bg-gray-500 p-2 w-3/4 rounded-3xl mx-auto" onClick={() => setAddCard(!addCard)}>Add Card</button>
                        <h2 className="mt-4">Pinned : </h2>
                        <div className="mt-4 overflow-y-auto" style={{maxHeight: '35vh'}}>
                        {Card && Card.map((card) => (
                            card.pin && 
                            <div className="flex justify-between items-center w-3/4 mx-auto">
                                <div key={card.id} className="p-2 cursor-pointer" onClick={() => openCard(card)}>{card.title}</div>
                                <TbPinnedOff className="text-gray-400 cursor-pointer hover:text-gray-500" onClick={() => unpinCard(card)}/>
                            </div>
                        ))}
                        </div>
                    </div> 
                </div>
            </div>
            {addCard && (
                <div className="w-1/4 right-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 dark:text-white text-black p-4 rounded-2xl" style={{zIndex: 1}}>
                    <div className="flex justify-between">
                        <h2>Add New Card</h2><button type="button" className="hover:bg-gray-500 p-1 font-medium" onClick={() => setAddCard(!addCard)}>X</button>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex flex-col items-center">
                        <input type="text" name="Card" id="Card" className="p-2 w-1/2 rounded bg-gray-500 dark:bg-gray-600 placeholder:text-center text-center focus:ring-0 text-black dark:text-white" placeholder="Profile Name" />
                        <button type="button" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => handleAddCard()}>Add</button>
                    </div>
                </div>
            )}

            {OpenCard && (
                <CardBox item={dataCardBox} closeCard={closeCard}/>
            )}

            {removeCard && (
                <RemoveCardBox item={dataCardBox} setRemoveCard={setRemoveCard} removeCard={removeCard} />
            )}
        </>
    )
}

export default HomePages
import { useEffect, useState } from "react"
import { TypeAnimation } from "react-type-animation"
import { db } from "../firebaseConfig"
import { onValue, ref } from "firebase/database"
import { GoTrash } from "react-icons/go"
import { IoReloadOutline } from "react-icons/io5";


const TrashPages = ({ProfileId, openCard, setOpenCard}) => {
    const [dataTrash, setDataTrash] = useState([])
    const [hoveroption, setHoveroption] = useState(0);
    const [trashopenCard, setTrashopenCard] = useState(false);

    const getCardTrash = async () => {
        const Ref = ref(db, `Trash - ${ProfileId}`)

        onValue(Ref, (snapshot) => {
            const data = snapshot.val()

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

                setDataTrash(newCardList)
            }else{
                setDataTrash([])
            }
        })
    }

    const removeCard = (id) => {
        const Ref = ref(db, `Trash - ${ProfileId}/${id}`)
        remove(Ref).then(() => {

        })
    }

    const recoveryCard = (id) => {
        const Ref = ref(db, `Trash - ${ProfileId}/${id}`)
        remove(Ref).then(() => {
            const Ref2 = ref(db, `Cards - ${ProfileId}/${id}`)
            set(Ref2, {
                title: dataTrash[hoveroption - 1].title,
                description: dataTrash[hoveroption - 1].description,
                pin: dataTrash[hoveroption - 1].pin,
                complete: dataTrash[hoveroption - 1].complete,
                date: dataTrash[hoveroption - 1].date
            })
        })
    }

    const openTrashCard = () => {
        setTrashopenCard(!trashopenCard)


    }
    useEffect(() => {
        getCardTrash()
    }, [ProfileId])

    return(
        <>
            <div style={{filter: openCard ? 'blur(5px)' : 'none'}}>
                <TypeAnimation
                    sequence={[
                        'This is Trash Pages', 1000,
                        'Where you can find all your deleted cards', 1000,
                        'Or you can restore them', 1000
                    ]}
                    wrapper="p"
                    cursor={true}
                    repeat={Infinity}
                    style={{fontSize: '30px', fontWeight: 'bold', fontFamily: 'monospace'}}
                    speed={50}
                    className="text-black dark:text-white"
                />

                <div className="grid lg:grid-cols-5 overflow-y-auto">
                    {
                        dataTrash && dataTrash.map((item) => (
                            <div key={item.id} className="bg-gray-700 p-5 m-4 rounded-3xl"
                            onMouseEnter={() => setHoveroption(item.id)} onMouseLeave={() => setHoveroption(0)}>
                                <h2 className="text-center text-white">{item.title}</h2>
                                <div className="relative"> 
                                    {item.id === hoveroption &&
                                    <div className="absolute bottom-3 right-2 transform translate-y-1/2 flex space-x-2">
                                        <GoTrash className="text-2xl text-red-500 hover:text-red-600" onClick={() => ''}/>
                                        <IoReloadOutline className="text-2xl text-green-500 hover:text-green-600" onClick={() => ''}/>
                                    </div>
                                    }
                                </div>  
                            </div>
                        ))
                    }
                </div>

                {trashopenCard ? (
                        <>

                        </>
                    ) : (
                        <>

                        </>
                    )
                }
            </div>
        </>
    )
}

export default TrashPages
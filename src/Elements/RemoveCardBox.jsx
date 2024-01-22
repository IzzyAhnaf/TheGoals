import { ref, remove } from "firebase/database"
import { db } from "../firebaseConfig"

const RemoveCardBox = ({item, setRemoveCard, removeCard}) => {
    const HremoveCard = (id) => {
        const IdProfile = localStorage.getItem('profileId')
        const Ref = ref(db, `Cards - ${IdProfile}/${id}`)
        const Ref2 = ref(db, `CheckList - ${id}`)

        try{
            remove(Ref).then(() => {
                if(Ref2){
                    remove(Ref2).then(() => {
                        setRemoveCard(!removeCard)
                    })
                }
            })
        }catch(error){

        }
    }
    return(
        <>
            <div className="bg-gray-500 dark:bg-gray-600 p-5 m-4 rounded-3xl text-black dark:text-white w-1/4
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{zIndex: 3, filter: 'blur(0px)'}}>
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">Remove - {item.title}</h1>
                    <button className="hover:bg-gray-500 p-1 font-medium" onClick={() => closeCard()}>X</button>
                </div>
                <hr className="my-4"/>
                <div className="flex flex-col">
                    <p>Are you sure you want to remove this card?</p>
                    <div className="flex">
                        <button type="button" className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => HremoveCard(item.id)}>Yes</button>
                        <button type="button" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4" onClick={() => setRemoveCard(!removeCard)}>No</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RemoveCardBox
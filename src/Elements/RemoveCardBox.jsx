import { get, onValue, push, ref, remove, set } from "firebase/database"
import { db } from "../firebaseConfig"
import { CiWarning } from "react-icons/ci";
import { GoTrash } from "react-icons/go";

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

    const HmovetoTrash = async (id) => {
        try {
            const IdProfile = localStorage.getItem('profileId');
            const Ref = ref(db, `Cards - ${IdProfile}/${id}`);
            const Ref2 = ref(db, `Trash - ${IdProfile}/${id}`);
    
            const cardSnapshot = await get(Ref);
    
            if (cardSnapshot.exists()) {
                const cardData = cardSnapshot.val();
    
                await set(Ref2, cardData);
                await remove(Ref);
                
            } else {
                console.error('Card not found.');
            }
        } catch (error) {
            console.error('Error moving card to trash:', error.message);
        } finally {
            setRemoveCard(!removeCard)
        }
    };
    
    return(
        <>
            <div className="bg-gray-500 dark:bg-gray-600 p-5 m-4 rounded-3xl text-black dark:text-white w-[500px]
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{zIndex: 3, filter: 'blur(0px)'}}>
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">Remove - {item.title}</h1>
                    <button className="hover:bg-gray-500 p-1 font-medium" onClick={() => closeCard()}>X</button>
                </div>
                <hr className="my-4"/>
                <div className="flex flex-col">
                    <p>Are you sure you want to remove this card?</p>
                    <div className="flex justify-between w-full h-[70px]">
                        <button type="button" className="outline outline-1 outline-red-500 hover:outline-red-700 hover:bg-red-700 font-bold py-1 px-4 rounded mt-4 flex items-center text-red-500 hover:text-white" onClick={() => HmovetoTrash(item.id)}>
                        <GoTrash className="mr-1"/> Move To Trash</button>
                        <button type="button" className="outline outline-1 outline-red-500 hover:outline-red-700 hover:bg-red-700 hover:text-white font-bold py-1 px-4 rounded mt-4 text-red-500 flex items-center" onClick={() => HremoveCard(item.id)}>
                        <CiWarning className="mr-1"/> Remove Permanent</button>
                        <button type="button" className="outline outline-1 outline-blue-500 hover:outline-blue-700 hover:bg-blue-700 text-blue-500 hover:text-white font-bold py-1 px-4 rounded mt-4" onClick={() => setRemoveCard(!removeCard)}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RemoveCardBox
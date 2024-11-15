import {create,persist} from '..';

export default function PersistComponent() {
    const persistedData = persist({
        data: 1,
        name:"count",
    })
    
    const useStore = create(persistedData);
    const {state,setState} = useStore();
    
    return (
        <div>
            <button onClick={()=>setState(prev=>prev!-1)}>Decrement</button>
            <h3>Count is: {state}</h3>
            <button onClick={()=>setState(prev=>prev!+1)}>Increment</button>
        </div>
    )
}

import { db, ref, update } from "./firebase";

const Choose = (num,port) => {
    const data = ref(db);
    return (
        update(data, { Choose: (num) }),
        update(data, { Port: (port) })
    )
}

export default Choose
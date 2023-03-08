
// returns boolean
checkIdType = (id) => {
    const availableSymbols = [0,1,2,3,4,5,6,7,8,9]

    if (!id || typeof id !== 'string'){
        return false;
    }
    
    for (let i = 0;i<id.length;i++){
        const num = parseInt(id[i])
        if (!availableSymbols.includes(num)){
            return false;
        }
    }

    return true;
}

module.exports = checkIdType
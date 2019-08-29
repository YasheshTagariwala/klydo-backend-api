let empty = data => {
    if(data){
        if(data.trim() == '' || data.length == 0) {
            return true;
        }
    }    

    return false;
}

let objectEmpty = data => {    
    if(data == null || data.length == 0 || data.length == '') {
        return true;
    }    
    return false;
}



module.exports = {
    'empty' : empty,
    'objectEmpty' : objectEmpty,
}

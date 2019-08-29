let KlyspaceData = loadModal('KlyspaceData');
let Klyspace = loadModal('Klyspace');

let getKlyspaceData = async (req, res) => {
    let [data,err] = await catchError(KlyspaceData.select(['id', 'klyspace_data', 'doer_profile_id', 'doee_profile_id'])
        .whereHas('doerUserProfile')
        .withSelect('doerUserProfile', ['first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image'])
        })
        .where('doee_profile_id', req.params.user_id).get());

    let new_data = [];
    let klySpace = null;
    if (data) {
        data = data.toJSON();

        let [variables,err1] = await catchError(Klyspace.select(['id'])
            .where('status', true)
            .orderBy('id', 'asc')
            .get());

        variables = variables.toJSON();

        let vector = [];
        for (let i = 0; i < variables.length; i++) {
            let tempData = data.filter((obj) => {
                return obj.klyspace_data.indexOf((+variables[i].id)) > -1 || obj.klyspace_data.indexOf(variables[i].id) > -1
            });

            let countData = {
                'klyspace_id': variables[i].id,
                'count': tempData.length
            };
            vector.push(countData);
        }

        vector.sort(SortByID);
        vector = vector.splice(0, 8);

        klySpace = vector;

        for (let i = 0; i < data.length; i++) {
            let vector = [];
            let klyData = data[i].klyspace_data;
            for (let j = 0; j < klyData.length; j++) {
                let tempData = data.filter((obj) => {
                    return obj.klyspace_data.indexOf((+klyData[j])) > -1 || obj.klyspace_data.indexOf(klyData[j]) > -1
                });

                let countData = {
                    'klyspace_id': klyData[j],
                    'count': tempData.length
                };
                vector.push(countData);
            }
            vector.sort(SortByID);
            vector = vector.splice(0, 8);
            new_data.push({klyspace_data: vector});
        }
    }

    for (let i = 0; i < data.length; i++) {
        data[i].klyspace_data = new_data[i].klyspace_data;
    }

    res.status(OK_CODE).json({auth: true, data: {user_data : data,klySpace : klySpace}});
}

function SortByID(x, y) {
    return y.count - x.count;
}

module.exports = {
    'getKlyspaceData': getKlyspaceData
};

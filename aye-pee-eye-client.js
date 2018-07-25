function ayePeeEye(myBaseUrl) {
    this.headers = {}
    let baseUrl = myBaseUrl
    let api = function (options) {
        return function (body) {
            return new Promise((resolve, reject) => {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let jsonResp = JSON.parse(this.responseText)
                        resolve(jsonResp)
                    }
                };
                xhttp.open("POST", options.url, true);
                if (ayePeeEye.headers)
                    for (prop in ayePeeEye.headers) xhttp.setRequestHeader(prop, ayePeeEye.headers[prop])
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(body ? JSON.stringify(body) : undefined);
            })
        }
    }
    this.createPostAPI = (extension) => api({
        url: baseUrl + extension
    })
    isloaded = false
    let functions_to_run_onload = []
    this.onload = (new_function) => {
        if (isloaded)
            new_function()
        else
            functions_to_run_onload.push(new_function)
    }
    this.apis = {}
    this.instantiateApis = (array_of_api_endpoints) => {
        let remove_empty_strings = (arr) => {
            let newArr = []
            arr.forEach(arrEl => {
                if (arrEl !== '') newArr.push(arrEl)
            })
            return newArr
        }

        array_of_api_endpoints = remove_empty_strings(array_of_api_endpoints)

        array_of_api_endpoints.forEach(single_api_endpoint => {
            let base_obj_to_mount_api_promise = this.apis
            let individual_file_or_folder_names = single_api_endpoint.split('/')
            individual_file_or_folder_names = remove_empty_strings(individual_file_or_folder_names)
            let return_true_if_this_is_the_last_element_in_array = index => index === individual_file_or_folder_names.length - 1
            for (i = 0; i < individual_file_or_folder_names.length; i++) {
                let individual_file_or_folder = individual_file_or_folder_names[i]
                if (return_true_if_this_is_the_last_element_in_array(i))
                    base_obj_to_mount_api_promise[individual_file_or_folder] = this.createPostAPI(single_api_endpoint)
                else if (!base_obj_to_mount_api_promise[individual_file_or_folder])
                    base_obj_to_mount_api_promise[individual_file_or_folder] = {}
                base_obj_to_mount_api_promise = base_obj_to_mount_api_promise[individual_file_or_folder]
            }
        })
    }

    this.getMethods = this.createPostAPI('/_getMethods_');

    let run_functions_onload = () => {
        isloaded = true
        functions_to_run_onload.forEach(func => func())
    }
    this.getMethods()
        .then(methods => this.instantiateApis(methods))
        .then(undef => run_functions_onload());

    return this
}

function initAyePeeEye() {
    let apiUrl = document.getElementById("aye-pee-eye").getAttribute("myApi")
    ayePeeEye = new ayePeeEye(apiUrl)
}

initAyePeeEye()

//module.exports = ayePeeEye
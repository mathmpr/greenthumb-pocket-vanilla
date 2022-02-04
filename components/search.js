class Search extends XElement {

    consumeUrl = 'https://front-br-challenges.web.app/api/v2/green-thumb/';

    searchInput = {
        sun: {
            name: 'sun',
            p: '<b>1.</b> Set the amount of <b>sunlight</b> your plant will get.',
            src: 'assets/images/illustrations/sun.png',
            options: {
                '': 'Select...',
                no: 'No',
                low: 'Low',
                high: 'High',
            }
        },
        water: {
            name: 'water',
            p: '<b>2.</b> How often do you want to <b>water</b> your plant?',
            src: 'assets/images/illustrations/wateringcan.png',
            options: {
                '': 'Select...',
                regularly: 'Regularly',
                daily: 'Daily',
                rarely: 'Rarely',
            }
        },
        pets: {
            name: 'pets',
            p: '<b>3.</b> Do you have pets? Do they <b>chew</b> plants?',
            src: 'assets/images/illustrations/dog.png',
            options: {
                '': 'Select...',
                'true': 'Yes',
                'false': 'No'
            }
        }
    };

    render() {
        return `
        <style>
            search-component .container-fluid {
                padding: 54px 15px;
            }            
            
            search-component .row.between {
                justify-content: space-between;
            }
            
            @media (max-width: 991px) {
                search-component .container-fluid {
                    padding: 34px 15px 54px;
                }
            }
        </style>
        <div class="container-fluid">
            <div class="row">
                <div class="container">
                    <div class="row between">
                        <div data-params="{{ searchInput.sun }}" class="col-lg-3 col-md-12 col-sm-12">
                            {{ render.SearchInput }} 
                        </div>
                        <div data-params="{{ searchInput.water }}" class="col-lg-3 col-md-12 col-sm-12">
                            {{ render.SearchInput }}
                        </div>
                        <div data-params="{{ searchInput.pets }}" class="col-lg-3 col-md-12 col-sm-12">
                            {{ render.SearchInput }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    xhr_arguments = {};

    toQueryString() {
        let string = '';
        for (let i in this.xhr_arguments) {
            string += i + '=' + this.xhr_arguments[i] + '&'
        }
        return string.slice(0, -1);
    }

    combine(input) {
        let self = this;
        if (empty(input.value)) {
            delete this.xhr_arguments[input.name];
        } else {
            this.xhr_arguments[input.name] = input.value;
        }
        if (Object.keys(this.xhr_arguments).length === Object.keys(this.searchInput).length) {
            new XHR(this.consumeUrl + '?' + this.toQueryString(), null, 'get').success((response) => {
                self.parentComponent.results(JSON.parse(response));
            }).error((response, status) => {
                if (status === 404) self.parentComponent.results(false);
            }).send();
        }
    }

}

defineComponent(Search);

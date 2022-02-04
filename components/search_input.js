/*
  this component took some additional work,
  the css for the native select box was not looking good because of a custom arrow
  I had already done this on another site https://www.d.hostingspirit.pt/virtual.html, but on this one I was not getting a good result
  To get a good result, a custom select input was made
 */

class SearchInput extends XElement {

    params = {};

    render() {
        return `        
        <style>
            searchinput-component p {
                max-width: 90%;
            }
            
            searchinput-component img{
                width: 100%;
            }
            
            searchinput-component .image-wrapper{
                width: 75px;
                height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            searchinput-component .select, searchinput-component .select select {
                width: 100%;
            }
            
            searchinput-component .select {
                position: relative;
                height: 32px;
                padding: 0 7px;
                left: -2px;
                border: 1px solid #A8A8A8;
                border-radius: 19px;
                display: block;
                width: 100%;
                z-index: 3;
            }
            
            searchinput-component .select div {
                z-index: 1;
                border-radius: 4px;
                border: 1px solid #A8A8A8;
                top: 30px;
                position: absolute;
                width: calc(100% - 14px);
                left: 7px;
                display: none;
                background-color: #fff;
            }
            
            searchinput-component .select div ul option {
                padding: 4px 7px;
                cursor: default;
                transition: 0.2s linear;        
            }
            
            @media (hover: hover) {            
                 searchinput-component .select div ul option:hover {
                    background-color: var(--third);
                    color: #fff;              
                 }
            }          
            
            
            searchinput-component .select *{
                margin: 0;
                padding: 0;
                list-style: none;
                user-select: none;
            }
            
            searchinput-component .select p{
                padding: 5px 0;
                position: relative;
                z-index: 2;
                cursor: default;
            }
            
            searchinput-component .select:after{
                width: 50px;
                height: 100%;
                display: block;
                content: ' ';
                right: 0;
                background-color: #fff;
                position: absolute;
                top: 0;
                border-radius: 19px;
                background-image: url(assets/images/icons/dropdown.svg);
                background-repeat: no-repeat;
                background-position: center;
            }
            
            @media (max-width: 1200px) {
                searchinput-component p {
                    max-width: 100%;
                }
            }
            
            @media (max-width: 991px) {
            
                searchinput-component {                    
                    margin-top: 20px;
                }
            }
            
        </style>
        <div class="image-wrapper"><img src="" alt="icon"></div>
        <p></p>
        <div class="select">
            <p></p>
            <div>
                <ul></ul>
            </div>
        </div>     
        `;
    }

    rendered = false;

    change(change) {

        if (change.type === 'mutation' && change.mutation.type === 'attributes' && !this.rendered) {
            this.rendered = true;
            try {
                this.params = JSON.parse(this.attr('data-params'));
            } catch (error) {
                this.params = this.attr('data-params');
            }
            if (is_object(this.params)) {
                this.mount();
            }
        }
    }

    mount() {
        this.select('img').src = this.params.src;
        this.select('p').innerHTML = this.params.p;
        this.select('.select').setAttribute('name', this.params.name);
        this.classList.add(this.params.name);
        for (let i in this.params.options) {
            let text = this.params.options[i];
            let option = document.createElement('option');
            option.value = i;
            option.innerText = text;
            if (this.select('.select ul').childNodes.length === 0) {
                this.select('.select p').innerText = text;
                this.select('.select p').setAttribute('value', i);
            }
            this.select('.select ul').appendChild(option);
        }

        this.select('.select').addEventListener('click', (event) => {
            // grant that the click is in the div .select
            let node = event.target;
            if (event.target.nodeName.toLowerCase() === 'p') {
                node = event.target.parentNode;
            }
            if (node.nodeName.toLowerCase() === 'div' && node.classList.contains('select')) {
                node.querySelector('div').style.display = 'block';
                let currentValue = node.querySelector('p').getAttribute('value');
                node.querySelectorAll('option').forEach((option) => {
                    option.style.display = 'block';
                    if (option.getAttribute('value') === currentValue) option.style.display = 'none';
                });
            }
        });

        this.selects('.select ul option').forEach((option) => {

            option.addEventListener('click', (event) => {

                let name = this.select('.select').getAttribute('name');
                let value = event.target.getAttribute('value');

                this.select('.select p').setAttribute('value', value);
                this.select('.select p').innerText = event.target.innerText;
                this.select('.select div').style.display = 'none';

                this.parentComponent.combine({
                    name,
                    value
                });

            });
        });

        // close select if click outside
        let close_if_click_outside = (event) => {
            let same = false;
            if (event.target.closest('searchinput-component .select') || (event.target.classList.contains('select') && event.target.closest('searchinput-component'))) {
                same = event.target.closest('searchinput-component');
                if (!same.isSameNode(this)) return false;
            }
            document.querySelectorAll('searchinput-component .select div').forEach((el) => {
                if (!same) {
                    el.style.display = 'none';
                } else {
                    if (!el.closest('searchinput-component').isSameNode(same)) {
                        el.style.display = 'none';
                    }
                }
            });
        }
        document.addEventListener('click', close_if_click_outside);

    }


}

defineComponent(SearchInput);

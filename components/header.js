class Header extends XElement {

    render() {

        return `
        <style>
            header {
                background-color: var(--third);
                background-image: url(./assets/images/hero/desktop/left-leaves.png), 
                                  url(./assets/images/hero/desktop/plantperson.png), 
                                  url(./assets/images/hero/desktop/right-leaves.png);
                background-repeat: no-repeat, no-repeat, no-repeat;
                background-size: auto 100%, auto 100%, auto 100%;
                background-position: top left, 75%, top right;
            }
            
            header .container {
                padding: 54px 15px;
            }
            
            header .container h1 {
                font-weight: 700;
                font-size: 70px;
                line-height: 80px;
                color: #fff;
                padding: 46px 0 30px;
            }
            
            @media(max-width: 1400px){
                header .container h1 {
                    font-size: 50px;
                    line-height: 60px;
                }
            }
            
            @media(max-width: 1200px){
                header .container h1 {
                    font-size: 40px;
                    line-height: 50px;
                }
            }
            
            @media(max-width: 991px){
                header {
                    background-image: url(./assets/images/hero/mobile/mobile-leaves.png), 
                                      url(./assets/images/hero/mobile/mobile-plantperson.png);
                    background-repeat: no-repeat, no-repeat;
                    background-size: 100% auto, 90% auto;
                    background-position: top left, center bottom;
                    min-height: 640px;
                }
                
                header .container {
                    padding: 40px 15px 240px;
                }
                
                header .container h1 {
                    font-size: 40px;
                    line-height: 50px;
                }
                
            }            
        </style>
        <header class="container-fluid">
            <div class="row">
                <div class="container">
                    <img src="assets/images/icons/logo-white.svg" alt="greenthumb pocket"/>
                    <h1>
                        Find your<br>
                        next green<br>
                        friend
                    </h1>         
                    <a href="#" class="anchor" data-target="search-component">
                        <img src="assets/images/icons/arrow.svg" alt="arrow"/>
                    </a>   
                </div>
            </div>            
        </header>`;
    }

    header_size() {
        this.querySelector('header').style.height = 'auto';
        if (document.body.clientWidth <= 991) {
            this.querySelector('header').style.height = window.innerHeight + 'px';
        }
    }

    loaded() {

        window.addEventListener('resize', () => {
            this.header_size();
        });
        this.header_size();

    }

}

defineComponent(Header);

class CardResults extends XElement {

    render() {
        return `
        <style>
        
            cardresults-component .pick {
                width: 158px;
            }
            
            cardresults-component .pick + h2 {
                font-size: 56px;
                line-height: 66px;
                font-weight: 700;
                color: #0C261C;
            }
        
            cardresults-component .container-fluid {
                background-color: #F2F2F2;
                padding-top: 52px;
            }
            
            cardresults-component #results .col-lg-6:first-child {
                position: relative;
            }
            
            cardresults-component #results .col-lg-6:first-child .row {
                height: 100%;
                position: relative;
            }
            
            cardresults-component #results *[class*="col-"] {
                margin-top: 30px;
            }
            
            #back-to-top {
                display: block;
                width: 100%;
                text-align: center;
                font-size: 16px;
                line-height: 20px;
                color: var(--primary);
                font-weight: 300;
                border: 1px solid var(--primary);
                border-radius: 50px;
                padding: 14px;
                margin-top: 60px;
                margin-bottom: 130px;
                cursor: pointer;
                transition: 0.2s linear;
            }
            
            #back-to-top svg {
                position: relative;
                top: 6px;
                margin-right: 17px;
            }
            
            #back-to-top svg g[stroke*="#"] {
                transition: 0.2s linear;
            } 
            
            @media (hover: hover) {
            
                 #back-to-top:hover {
                    background-color: var(--primary);
                    color: #fff;     
                 }
                 
                 #back-to-top:hover svg g[stroke*="#"] {
                    stroke: #fff;
                 } 
            }            
            
            @media (max-width: 991px) {
                
                cardresults-component #results > .col-lg-6 + .col-lg-6 {
                    margin-top: 0;
                }
                
                cardresults-component .pick {
                    width: 112px;
                }
                
                cardresults-component .pick + h2 {
                    font-size: 36px;
                    line-height: 46px;
                    margin-bottom: 52px;
                }           
                
                cardresults-component #results {
                    overflow-x: auto;
                    overflow-y: hidden;
                    white-space: nowrap;
                    flex-wrap: initial;
                    padding-right: 15px;
                }
                
                cardresults-component #results .row {
                    flex: none;
                    flex-wrap: initial;
                    margin: 0;
                }               
                      
                cardresults-component #results *[class*="col-"]{
                    flex: none;
                    display: inline-block !important;
                    width: auto;
                    padding: 0;
                    margin-left: 15px;
                    margin-top: 0;
                }
                
                cardresults-component #results .row > *[class*="col-"]:first-child{
                    margin-left: 0;
                }
                              
            }
            
        </style>
        <div class="container-fluid">
            <div class="row">
                <div class="container">
                    <img class="pick" src="assets/images/illustrations/pick.png" alt="pick"/>
                    <h2>Our picks <br class="mobile"> for you</h2>
                    <div id="results" class="row"></div>
                    <div class="row">
                        <div class="col-12">
                            <a id="back-to-top" class="anchor" href="#" data-target="search-component">                            
                                <svg width="18px" height="23px" viewBox="0 0 18 23" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">                                
                                    <g id="desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="d.-results" transform="translate(-622.000000, -1901.000000)" stroke="#15573F" stroke-width="0.799999952">
                                            <g id="back-to-the-top" transform="translate(270.000000, 1888.000000)">
                                                <path d="M358.64305,33 L350.000253,24.5 L358.64305,16 M350,24.5 L372,24.5" id="seta" transform="translate(361.000000, 24.500000) rotate(90.000000) translate(-361.000000, -24.500000) "></path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <span>back to the top</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    render_cards(results) {

        this.select('#results').innerHTML = `
                    <div class="target-1 col-lg-6 col-md-12 col-xs-12">
                        <div class="row"></div>
                    </div>
                    <div class="target-2 col-lg-6 col-md-12 col-xs-12">
                        <div class="row"></div>
                    </div>`;

        let filtered = [];
        let count = 0;

        // put favorite in first position
        // for each favorite, increment the number of other plant that is no favorite to append in second .col-lg-6
        results.forEach((result) => {
            if (result.staff_favorite) {
                count += 5;
                filtered.splice(0, 0, result);
            } else {
                filtered.push(result);
            }
        });

        filtered.forEach((result) => {
            let card;
            if (count > 0 && result.staff_favorite) {
                // render staff element in .row at first .col-lg-6
                card = new Render(Card).render(this.select('#results').firstElementChild.firstElementChild);
            } else if (count > 0) {
                // render next four elements in .row at last .col-lg-6
                card = new Render(Card).render(this.select('#results').lastElementChild.firstElementChild);
            } else {
                // other wise render another elements normally
                card = new Render(Card).render(this.select('#results'));
            }
            card.populate_card(result, count);
            count--;
        });

        // clear if empty
        ['#results .target-1 .row', '#results .target-2 .row'].forEach((selector) => {
            let row = this.select(selector);
            if (row.childNodes.length === 0) {
                row.parentNode.parentNode.removeChild(row.parentNode);
            }
        });

        this.mobile_scroll();

    }

    mobile_scroll() {

        let to_horizontal_scroll = () => {
            if (document.body.clientWidth <= 991) {
                // read each card and set size to card
                this.selects('#results card-component').forEach((el, index) => {
                    el.style.width = (this.select('#results').clientWidth - 30) + 'px';
                    // consider card and columns margins defined in css <style>
                    let margins = parseInt(window.getComputedStyle(el).marginRight.replace('px', '')) + parseInt(window.getComputedStyle(el).marginLeft.replace('px', ''))

                    // if current card is the first card of a row,
                    // then the row width equal a one width of a card
                    if (el.closest('.row').firstElementChild.isSameNode(el)) {
                        el.closest('.row').style.width = (this.select('#results').clientWidth - 30 + margins) + 'px'
                    } else {
                        // for other cards inside same row,
                        // preserve row width and plus more one width of a card
                        el.closest('.row').style.width = (el.closest('.row').clientWidth + (this.select('#results').clientWidth - 30 + margins)) + 'px'
                    }
                });
                // result is all cards with defined width and all parent rows of these cards with defined width
            } else {
                // if is desktop, simple
                // just find all elements in #result with defined width and set width as auto
                this.selects('#results *[style*="width"]').forEach((el, index) => {
                    el.style.width = 'auto';
                });
            }
        }

        // each window resize, resize cards and .row's
        window.addEventListener('resize', to_horizontal_scroll);
        to_horizontal_scroll();
    }
}

defineComponent(CardResults);

class Card extends XElement {

    card_data = {};

    render() {
        return `
        <style>
            card-component{
                display: block;
            }
        
            card-component .card-container{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                position: relative;
                width: 100%;
                background-color: #fff;
                border-radius: 5px;
                padding-bottom: 85px;
            }
        
            card-component .card-container .plant{
                max-height: 180px;
                max-width: 80%;
                margin: 20px 0 0;
            }
            
            card-component.staff-favorite .card-container {
                padding-bottom: 130px;
            }
            
            card-component.staff-favorite .card-container .plant{
                max-height: 410px;
                min-width: 45%;
            }
            
            card-component .info{
                width: 100%;
                padding: 15px 20px 10px;
                position: absolute;
                bottom: 0;
            }
            
            card-component .info ul {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            
            card-component .info ul li {
                display: none;                
            }
            
            card-component .info ul li:not(:first-child){
                margin-left: 5px;
            }
            
            card-component .info p {
                font-weight: 700;
                font-size: 16px;
                line-height: 28px;
                color: var(--primary);
                margin: 0;
            }
            
            card-component .info div > p {
                float: left;
            }
            
            card-component .info ul {
                float: right;
            }
            
            card-component.staff-favorite .info > p{
                width: 50%;
                float: left;
            }
            
            card-component.staff-favorite .info > div{
                width: 50%;
                float: right;
                text-align: right;
            }
            
            card-component.staff-favorite .info div > p {
                float: none;
            }
            
            card-component.staff-favorite .info ul {
                float: none;
            }
            
            card-component.staff-favorite .info p {                
                font-size: 36px;
                line-height: 46px;
                margin-bottom: 10px;
            }
            
            card-component li.toxicity img{
                width: 20px;
            }
            
            card-component li.regularly img{
                width: 20px;
            }
            
            card-component li.daily img{
                width: 25px;
            }
            
            card-component li.rarely img{
                width: 30px;
            }
            
            card-component li.no img{
                width: 22px;
            }
            
            card-component li.low img{
                width: 26px;
            }
                     
            card-component.staff-favorite li.toxicity img{
                width: 30px;
            }
            
            card-component.staff-favorite li.regularly img{
                width: 30px;
            }
            
            card-component.staff-favorite li.daily img{
                width: 35px;
            }
            
            card-component.staff-favorite li.rarely img{
                width: 40px;
            }
            
            card-component.staff-favorite li.no img{
                width: 32px;
            }
            
            card-component.staff-favorite li.low img{
                width: 36px;
            }
            
            card-component.staff-favorite li.high img{
                width: 40px;
            }
            
            card-component .staff {
                display: none;
                padding: 10px 50px 10px 10px;
                border-radius: 0 50px 50px 0;
                position: absolute;
                top: 25px;
                left: 0;
                background-color: var(--third);
            }
            
            card-component.staff-favorite .staff {
                display: block;
                color: #fff;
                font-weight: 700;
                font-size: 18px;
            }
            
            card-component.staff-favorite .staff span{
                font-weight: normal;
            }
            
            @media(max-width: 991px) {
            
                card-component .card-container .plant{
                    max-height: 250px !important;
                    max-width: 70%;
                    margin: 20px 0 0;
                }
                
                card-component.staff-favorite li.toxicity img{
                    width: 20px;
                }
                
                card-component.staff-favorite li.regularly img{
                    width: 20px;
                }
                
                card-component.staff-favorite li.daily img{
                    width: 25px;
                }
                
                card-component.staff-favorite li.rarely img{
                    width: 30px;
                }
                
                card-component.staff-favorite li.no img{
                    width: 22px;
                }
                
                card-component.staff-favorite li.low img{
                    width: 26px;
                }
                
                card-component.staff-favorite li.high img{
                    width: 30px;
                }
                
                card-component.staff-favorite .info p {                
                    font-size: 16px;
                    line-height: 28px;
                    margin-bottom: 0;
                }
                
                card-component .staff {
                    padding: 8px 35px 8px 8px;
                    border-radius: 0 50px 50px 0;                    
                    top: 15px;                    
                }
                
                card-component.staff-favorite .card-container{
                    padding-bottom: 82px;
                }               
              
                
            }
            
        </style>              
        <div class="card-container">
            <div class="staff">
                <span>✨</span> Staff favorite
            </div>
            <img class="plant" alt="{{ card_data.name }}">
            <div class="info">
                <p>{{ card_data.name }}</p>
                <div>
                    <p>$ {{ card_data.price }}</p>
                    <ul>
                        <li class="toxicity"><img alt="toxic" src="assets/images/icons/toxic.svg"/></li>
                        <li class="regularly"><img alt="1-drop" src="assets/images/icons/1-drop.svg"/></li>
                        <li class="daily"><img alt="2-drop" src="assets/images/icons/2-drops.svg"/></li>
                        <li class="rarely"><img alt="3-drop" src="assets/images/icons/3-drops.svg"/></li>
                        <li class="no"><img alt="no-sun" src="assets/images/icons/no-sun.svg"/></li>
                        <li class="low"><img alt="low-sun" src="assets/images/icons/low-sun.svg"/></li>
                        <li class="high"><img alt="high-sun" src="assets/images/icons/high-sun.svg"/></li>                        
                    </ul>
                </div>
            </div>
        </div>          
        `;
    }

    populate_card(data, count) {

        let classes = this.classList.value;
        this.classList.value = classes + ' col-lg-3 col-md-12 col-sm-12';
        if (data.staff_favorite) {
            this.classList.value = classes + ' col-12 staff-favorite';
        }
        if (!data.staff_favorite && count > 0) {
            this.classList.value = classes + ' col-lg-6 col-md-12 col-sm-12';
        }

        this.select('.' + data.sun).style.display = 'inline-block';
        this.select('.' + data.water).style.display = 'inline-block';
        if (data.toxicity) this.select('.toxicity').style.display = 'inline-block';

        // I can use {{ card_data.url }} in src, but this cause 404 not found {{ card_data.url }} at first moment
        this.select('.plant').src = data.url;
        this.card_data = data;
        this.changes();
    }
}

defineComponent(Card);

class NotFound extends XElement {

    render() {
        return `
        <style>
            notfound-component .container-fluid {
                background-color: #f2f2f2;
                padding: 72px 15px;
            }
            
            notfound-component * {
                color: #a9a9a9;
            }
            
            notfound-component h3 {
                font-size: 46px;
                line-height: 56px;
                margin-bottom: 15px;
                font-weight: 700;
            }
            
            notfound-component .col-lg-6 {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
        </style>
        <div class="container-fluid">
            <div class="row">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 col-sm-12">
                            <div>
                                <h3>No results yet…</h3>
                                <p>Use the filters above to find <br class="desktop"> the plant that best fits your <br class="desktop"> environment :)  </p>
                            </div>                                    
                        </div>
                        <div class="col-lg-6 col-sm-12">
                            <img src="assets/images/illustrations/no-results.png" alt="not found"/>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>`;
    }

}

defineComponent(NotFound);



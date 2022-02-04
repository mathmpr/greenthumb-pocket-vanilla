class Index extends XElement {

    search;
    _404;
    card_results;

    render() {
        return `
        <div id="header">{{ render.Header }}</div>
        <!-- after load render search component -->        
        <div>{{ search }}</div>
        <div>{{ _404 }}</div>
        <div>{{ card_results }}</div>
        `;
    }

    // component loaded life cycle
    loaded() {
        this.proxy.search = new Render(Search, {
            parent: this
        }).render();
    }

    // component changes life cycle
    change(change) {
        //console.log(change);
    }

    results(results) {
        if (results) {
            this.proxy._404 = null;
            if (!this.card_results) {
                this.proxy.card_results = new Render(CardResults).render();
            }
            this.card_results.render_cards(results);
            scroll({
                top: getCoords(this.card_results).top,
                behavior: "smooth"
            });
        } else {
            this.proxy._404 = new Render(NotFound).render();
            this.proxy.card_results = null;
            scroll({
                top: getCoords(this.proxy._404).top,
                behavior: "smooth"
            });
        }
    }
}

defineComponent(Index);

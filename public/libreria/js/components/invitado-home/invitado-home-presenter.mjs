import { Presenter } from "../../commons/presenter.mjs";
import { InvitadoCatalogoLibroPresenter } from "../invitado-catalogo-libro/invitado-catalogo-libro-presenter.mjs";

export class InvitadoHomePresenter extends Presenter {

    constructor(model, view){
        super(model, view);
    }

    get catalogoElement(){
        return document.querySelector('#catalogo');
    }

    async refresh(){
        await super.refresh();
        let libros = this.model.getLibros();

        await Promise.all(
            libros.map(async (l) => { 
                return await new InvitadoCatalogoLibroPresenter(l, 'invitado-catalogo-libro', '#catalogo').refresh() 
            })
        );    
    }

    

}
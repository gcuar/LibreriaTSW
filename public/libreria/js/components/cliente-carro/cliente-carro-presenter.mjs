import { Presenter } from "../../commons/presenter.mjs";
import { model } from "../../model/model.mjs"; 

export class ClienteCarroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view); 
  }

  async refresh() {
    await super.refresh();
    // añadir otra lógica //

    console.log("Nueva Página cargada con éxito");
  }
}
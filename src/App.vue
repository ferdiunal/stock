<template>
  <v-app dark>
    <v-content class="pa-3">
        <v-data-table
          :headers="headers"
          :items="rows"
          :items-per-page="10" 
          class="elevation-1"
        > 
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Ürünler</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field v-model.trim.lazy="like" placeholder="Ara" single-line class="px-3" clearable hint="Ürün adı ve Ürün tipinde arama yapın"/>
              <v-add />
            </v-toolbar>
          </template>
          <template v-slot:item.action="{ item }">
            <v-assign v-bind="item" />
            <v-assign-list v-bind="item" />
            <v-edit v-bind="item"/>
            <v-delete v-bind="item" />
          </template>
        </v-data-table>
    </v-content>
  </v-app>
</template>
<script>
import moment from "moment-timezone";
import Add from "./components/Add";
import Edit from "./components/Edit";
import Delete from "./components/Delete";
import Assign from "./components/Assign";
import AssignList from "./components/AssignList";
export default {
  name: 'App',
  components: {
    "v-add": Add,
    "v-edit": Edit,
    "v-delete": Delete,
    "v-assign": Assign,
    "v-assign-list": AssignList,
  },
  data:() => ({
    expanded: [],
    like: "",
    headers: [
      {
        text: 'Ürün Adı',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Ürün Tipi', value: 'type' },
      { text: 'Stok Adedi', value: 'count' },
      { text: 'Oluşturma Tarihi', value: 'createdAt' },
      { text: 'Güncelleme Tarihi', value: 'updatedAt' },
      { text: '', value: 'action', align: "end", sortable: false },
    ],
    rows: []
  }),
  watch: {
    like(e) {
      if(!!e) { // eslint-disable-line
        const rows = this.rows.slice();
        this.rows = rows.filter(w => w.name.concat(w.type).search(e.toLocaleUpperCase()) > -1)
      } else if(!e) {
        this.$ipc.send("loaded:app")
      }
    }
  },
  created() {
    document.title = "Ürün Stok Yönetimi"
    this.$ipc.send("loaded:app")
    const vm = this;
    this.$ipc.on("load:products", function(_, rows){
      vm.rows = rows.filter(e => !e.deletedAt).map(e => ({
        ...e,
        createdAt: moment(e.createdAt).format("LLL"),
        updatedAt: moment(e.updatedAt).format("LLL")
      }))
    });
  },
};
</script>

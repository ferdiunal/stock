<template>
    <v-dialog v-model="dialog" persistent max-width="900px">
      <template v-slot:activator="{ on }">
        <v-tooltip bottom>
            <template v-slot:activator="onTool">
                <v-icon v-on="{...on, ...onTool.on}">
                    mdi-format-list-checks
                </v-icon>
            </template>
            <span> {{ name }} Geçmiş Talep Listesi</span>
        </v-tooltip>
      </template>
      <v-card>
        <v-data-table
            :headers="headers"
            :items="rows"
            :items-per-page="5"
            > 
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>{{ name }} Geçmiş Talep Listesi</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-3" icon @click.native="dialog = false">
                        <v-icon > mdi-close </v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
                <v-return v-if="item.count !== item.return" v-bind="{row: item, product: $props }" />
            </template>
        </v-data-table>
      </v-card>
    </v-dialog>
</template>

<script>
import moment from "moment-timezone";
import Return from "./Return"
export default {
    props: {
        id: String,
        name: String,
        count: Number,
        type: String,
        description: String
    },
    components: {
        'v-return': Return
    },
    data: () => ({
        dialog: false,
        headers: [
            {
                text: 'Adı Soyadı',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Açıklama', value: 'description', sortable: false},
            { text: 'Adedi', value: 'count', sortable: false},
            { text: 'İade Adedi', value: 'return', sortable: false},
            {text: 'Talep Oluşturma Tarih', value: 'createdAt'},
            {text: 'Talep Güncelleme Tarih', value: 'updatedAt'  },
            { text: '', value: 'action', align: "end", sortable: false },
        ],
        rows: []
    }),
    watch: {
        dialog(e) {
            if(e) {
                this.$ipc.send("loaded:assignList", this.id)
                this.$ipc.on("assigns:rows", (_, rows) => {
                    this.rows = rows.map(e => ({
                        ...e,
                        createdAt: moment(e.createdAt).format("LLL"),
                        updatedAt: moment(e.updatedAt).format("LLL")
                    }));
                })
                return;
            }
        }
    },
}
</script>

<style>

</style>
<template>
  
    <v-dialog v-model="dialog" persistent max-width="350px">
      <template v-slot:activator="{ on }">
        <v-tooltip bottom>
            <template v-slot:activator="onTool">
                <v-icon v-on="{...on, ...onTool.on}">
                    mdi-share
                </v-icon>
            </template>
            <span>Ürünü İade Et</span>
        </v-tooltip>
      </template>
      <v-card>
        <v-card-title class="headline">{{ product.name }} Ürünü İade Et</v-card-title>

        <v-card-text>
            <v-text-field type="number" v-model.number="return_" min="1" :max="row.count - row.return" label="İade Adedi*" required />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey lighten-2" text :disabled="loading" @click.native="dialog = false" >
          Vazgeç
          </v-btn>

          <v-btn color="red darken-1" text :loading="loading" @click.native="save" >
            Gönder
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        row: Object,
        product: Object
    },
    data: () => ({
        dialog: false,
        return_: 0,
        loading: false,
    }),
    watch: {
        dialog(e) {
            if(e) {
                this.return_ = 0;
            }
        }
    },
    methods: {
        save() {
        this.loading = true

        this.$ipc.send("assign:return", JSON.stringify({
          product_id: this.row.product_id,
          return: this.return_,
          assign_id: this.row.id
        }))
        this.$ipc.on("assign:returned", () => {
          this.loading = false;
          this.dialog = false;
        })
        }
    }
}
</script>

<style>

</style>
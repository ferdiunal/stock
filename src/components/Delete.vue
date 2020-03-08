<template>
    <v-dialog v-model="dialog" persistent max-width="350px">
      <template v-slot:activator="{ on }">
        <v-tooltip bottom>
            <template v-slot:activator="onTool">
                <v-icon v-on="{...on, ...onTool.on}">
                    mdi-delete
                </v-icon>
            </template>
            <span>Ürünü Sil</span>
        </v-tooltip>
      </template>
      <v-card>
        <v-card-title class="headline">UYARI</v-card-title>

        <v-card-text>
            {{ name }} adlı ürünü silmek istediğinizden emin misiniz ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey lighten-2" text :disabled="loading" @click.native="dialog = false" >
          Vazgeç
          </v-btn>

          <v-btn color="red darken-1" text :loading="loading" @click.native="save" >
            Eminim, Sil
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
      id: String,
      name: String,
      count: Number,
      type: String,
      description: String
  },
  data: () => ({
      dialog: false,
      loading: false
  }),
  methods: {
    save() {
        this.loading = true
        this.$ipc.send("product:update", JSON.stringify({
          id: this.id,
          form: {
              deletedAt: Date.now()
          }
        }))
        this.$ipc.on("product:updated", () => {
          this.loading = false;
          this.dialog = false;
        })
    }
  },
}
</script>

<style>

</style>
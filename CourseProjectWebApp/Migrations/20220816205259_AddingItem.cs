using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseProjectWebApp.Migrations
{
    public partial class AddingItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Item",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CollectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Item_Collection_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "Collection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemsAdditionalStrings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Data = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: true),
                    AdditionalStringsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemsAdditionalStrings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemsAdditionalStrings_AdditionalStrings_AdditionalStringsId",
                        column: x => x.AdditionalStringsId,
                        principalTable: "AdditionalStrings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemsAdditionalStrings_Item_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Item",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Item_CollectionId",
                table: "Item",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsAdditionalStrings_AdditionalStringsId",
                table: "ItemsAdditionalStrings",
                column: "AdditionalStringsId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsAdditionalStrings_ItemId",
                table: "ItemsAdditionalStrings",
                column: "ItemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemsAdditionalStrings");

            migrationBuilder.DropTable(
                name: "Item");
        }
    }
}

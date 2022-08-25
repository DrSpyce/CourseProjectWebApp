using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseProjectWebApp.Migrations
{
    public partial class AddLikesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ItemUserLike",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    itemId = table.Column<int>(type: "int", nullable: false),
                    ApplicationUserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemUserLike", x => x.id);
                    table.ForeignKey(
                        name: "FK_ItemUserLike_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemUserLike_Item_itemId",
                        column: x => x.itemId,
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemUserLike_ApplicationUserId",
                table: "ItemUserLike",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemUserLike_itemId",
                table: "ItemUserLike",
                column: "itemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemUserLike");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseProjectWebApp.Migrations
{
    public partial class CollectionUserDependency : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Collection",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Collection_ApplicationUserId",
                table: "Collection",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Collection_AspNetUsers_ApplicationUserId",
                table: "Collection",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collection_AspNetUsers_ApplicationUserId",
                table: "Collection");

            migrationBuilder.DropIndex(
                name: "IX_Collection_ApplicationUserId",
                table: "Collection");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Collection");
        }
    }
}

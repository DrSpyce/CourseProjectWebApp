using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseProjectWebApp.Migrations
{
    public partial class makeTitleUnique : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Collection",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Collection_Title",
                table: "Collection",
                column: "Title",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Collection_Title",
                table: "Collection");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Collection",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}

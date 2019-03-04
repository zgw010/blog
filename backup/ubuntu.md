隐藏上边栏

css修改

`sudo vim /usr/share/gnome-shell/theme/ubuntu.css`

在文件末尾添加
```css
#panel,#panel *{
  height: 0px;
  color: rgba(0, 0, 0, 0)
}
```

从桌面上永久隐藏 Ubuntu Dock，而不是将其删除

如果你希望永久隐藏 Ubuntu Dock，不让它显示在桌面上，但不删除它或使用原生 Gnome 会话，你可以使用 Dconf 编辑器轻松完成此操作。这样做的缺点是 Ubuntu Dock 仍然会使用一些系统资源，即使你没有在桌面上使用它，但你也可以轻松恢复它而无需安装或删除任何包。

Ubuntu Dock 只对你的桌面隐藏，当你进入叠加模式（活动）时，你仍然可以看到并从那里使用 Ubuntu Dock。

要永久隐藏 Ubuntu Dock，使用 Dconf 编辑器导航到 /org/gnome/shell/extensions/dash-to-dock 并禁用以下选项（将它们设置为 false）：autohide、dock-fixed 和 intellihide。

如果你愿意，可以从命令行实现此目的，运行以下命令：
```
gsettings set org.gnome.shell.extensions.dash-to-dock autohide false

gsettings set org.gnome.shell.extensions.dash-to-dock dock-fixed false

gsettings set org.gnome.shell.extensions.dash-to-dock intellihide false
```
如果你改变主意了并想撤销此操作，你可以使用 Dconf 编辑器从 /org/gnome/shell/extensions/dash-to-dock 中启动 autohide、 dock-fixed 和 intellihide（将它们设置为 true），或者你可以使用以下这些命令：
```
gsettings set org.gnome.shell.extensions.dash-to-dock autohide true

gsettings set org.gnome.shell.extensions.dash-to-dock dock-fixed true

gsettings set org.gnome.shell.extensions.dash-to-dock intellihide true
```

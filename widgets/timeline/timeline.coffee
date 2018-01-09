class Dashing.Timeline extends Dashing.Widget

  ready: ->
    @renderTimeline(@get('events'))

  onData: (data) ->
    # Handle incoming data
    # You can access the html node of this widget with `@node` E8F770 616161
    # Example: $(@node).fadeOut().fadeIn() will make the node flash each time data comes in.
    if data.events
        @renderTimeline(data.events)

  renderTimeline: (events) ->
    # Margins: zero if not set or the same as the opposite margin
    # (you likely want this to keep the chart centered within the widget)
    left = @get('leftMargin') || 0
    right = @get('rightMargin') || left
    top = @get('topMargin') || 0
    bottom = @get('bottomMargin') || top

    container = $(@node).parent()
    # Gross hacks. Let's fix this.
    width = (Dashing.widget_base_dimensions[0] * container.data("sizex")) + Dashing.widget_margins[0] * 2 * (container.data("sizex") - 1) - left - right
    height = (Dashing.widget_base_dimensions[1] * container.data("sizey")) - ($(@node).find("h1").outerHeight() + 12) - top - bottom
    id = "." + @get('id')
    TimeKnots.draw(id, events, {horizontalLayout: false, color: "#222222", height: height, width: width, showLabels: true, labelFormat:"%H:%M"});